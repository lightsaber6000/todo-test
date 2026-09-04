import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import {
    createNote,
    deleteNote,
    getNoteList,
    updateNote,
} from "@/db/repositories/notes";
import { broadcastNoteDeleted } from "@/services/notesSync";
import { useNotesStore } from "@/stores/notes";
import type { Note } from "@/types/note";

vi.mock("@/db/repositories/notes", () => ({
    createNote: vi.fn(),
    deleteNote: vi.fn(),
    getNoteList: vi.fn(),
    updateNote: vi.fn(),
}));

vi.mock("@/services/notesSync", () => ({
    broadcastNoteDeleted: vi.fn(),
}));

const makeNote = (id = "note-1"): Note => ({
    id,
    title: "Заголовок заметки",
    todos: [{ id: "todo-1", text: "Задача", complete: false }],
});

describe("notesStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it("загрузка заметок из репозитория", async () => {
        const notes = [makeNote()];
        vi.mocked(getNoteList).mockResolvedValue(notes);
        const store = useNotesStore();

        await store.hydrate();

        expect(getNoteList).toHaveBeenCalledOnce();
        expect(store.notes).toEqual(notes);
    });

    it("создние заметки в репозитории и состоянии", async () => {
        const note = makeNote();
        vi.mocked(createNote).mockResolvedValue(note.id);
        const store = useNotesStore();

        const id = await store.create(note);

        expect(createNote).toHaveBeenCalledWith(note);
        expect(store.notes).toEqual([note]);
        expect(id).toBe(note.id);
    });

    it("обновление заметки в репозитории и состоянии", async () => {
        const note = makeNote();
        const changes: Partial<Note> = { title: "Обновлённый заголовок" };
        vi.mocked(updateNote).mockResolvedValue(1);
        const store = useNotesStore();
        store.notes = [note];

        const updated = await store.update(note.id, changes);

        expect(updateNote).toHaveBeenCalledWith(note.id, changes);
        expect(store.notes[0]).toEqual({ ...note, ...changes });
        expect(updated).toBe(true);
    });

    it("удаление заметки из репозитория и состояния", async () => {
        const note = makeNote();
        const remainingNote = makeNote("note-2");
        vi.mocked(deleteNote).mockResolvedValue(undefined);
        const store = useNotesStore();
        store.notes = [note, remainingNote];

        const removed = await store.remove(note.id);

        expect(deleteNote).toHaveBeenCalledWith(note.id);
        expect(store.notes).toEqual([remainingNote]);
        expect(broadcastNoteDeleted).toHaveBeenCalledWith(note.id);
        expect(removed).toBe(true);
    });

    it("не обновляет состояние, если заметка уже удалена", async () => {
        const note = makeNote();

        vi.mocked(updateNote).mockResolvedValue(0);

        const store = useNotesStore();
        store.notes = [note];

        const updated = await store.update(note.id, {
            title: "Новое название",
        });

        expect(updated).toBe(false);
        expect(store.notes[0]).toEqual(note);
    });

    it("локально удаляет заметку без обращения к репозиторию", () => {
        const note = makeNote();
        const remainingNote = makeNote("note-2");

        const store = useNotesStore();
        store.notes = [note, remainingNote];

        store.removeLocal(note.id);

        expect(store.notes).toEqual([remainingNote]);
        expect(deleteNote).not.toHaveBeenCalled();
        expect(broadcastNoteDeleted).not.toHaveBeenCalled();
    });
});
