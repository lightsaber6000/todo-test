import { ref } from "vue";
import { defineStore } from "pinia";
import { getDraft, saveDraft, removeDraft } from "@/db/repositories/drafts";
import { type Draft } from "@/types/note";

export const useDraftsStore = defineStore("drafts", () => {
    const draft = ref<Draft | null>(null);

    const load = async (id: string): Promise<void> => {
        draft.value = await getDraft(id) ?? null;
    };

    const save = async (dr: Draft, id: string): Promise<void> => {
        await saveDraft(dr, id);
        draft.value = dr;
    };

    const remove = async (id: string): Promise<void> => {
        await removeDraft(id);
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