import { ref } from "vue";
import { defineStore } from "pinia";
import { type Draft } from "@/types/note";

type StoredDraft = Draft & {
    schemaVersion: number;
};

const schemaVersion = 1;
const getKey = (id: string) => `note-draft:${id}`;

export const useDraftsStore = defineStore("drafts", () => {
    const draft = ref<Draft | null>(null);

    const load = (id: string) => {
        const key = getKey(id);

        try {
            const stored = JSON.parse(localStorage.getItem(key) ?? "null") as StoredDraft | null;

            if (
                stored?.schemaVersion !== schemaVersion ||
                stored.noteId !== id ||
                !stored.note
            ) {
                localStorage.removeItem(key);
                draft.value = null;
                return;
            }

            draft.value = {
                noteId: stored.noteId,
                note: stored.note,
            };
        } catch {
            draft.value = null;
        }
    };

    const save = (dr: Draft, id: string) => {
        localStorage.setItem(
            getKey(id),
            JSON.stringify({ ...dr, schemaVersion } satisfies StoredDraft),
        );

        draft.value = dr;
    };

    const remove = (id: string) => {
        localStorage.removeItem(getKey(id));
        draft.value = null;
    };

    const clear = () => {
        draft.value = null;
    };

    return {
        draft,
        load,
        save,
        remove,
        clear,
    };
});
