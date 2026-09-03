import { ref } from "vue";
import { defineStore } from "pinia";
import { getNoteList, createNote, updateNote, deleteNote } from "@/db/repositories/notes";
import { type Note } from "@/types/note";

export const useNotesStore = defineStore('notes', () => {
    const notes = ref<Note[]>([]);

    const hydrate = async (): Promise<void> => {
        notes.value = await getNoteList();
    }

    const create = async (note: Note): Promise<string> => {
        const id = await createNote(note);

        notes.value.push(note);

        return id;
    };

    const update = async (id: string, note: Partial<Note>): Promise<boolean> => {
        const updatedRecordsCount = await updateNote(id, note);

        if (!updatedRecordsCount) {
            return false;
        }

        const index = notes.value.findIndex(note => note.id === id);

        if (index !== -1) {
            notes.value[index] = {
                ...notes.value[index]!,
                ...note,
            };
        }

        return true;
    };

    const remove = async (id: string): Promise<boolean> => {
        await deleteNote(id);
        notes.value = notes.value.filter(el => el.id !== id);
        return true;
    };

    const get = async (id: string): Promise<Note | undefined> => {
        return notes.value.find(el => el.id === id);
    };

    return {
        notes,
        hydrate,
        create,
        update,
        remove,
        get,
    };
});