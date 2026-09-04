import { db } from "~/db/db";
import type { Draft } from "~/types/note";

export const getDraft = async (id: string): Promise<Draft | undefined> => {
    return db.draft.get(id);
};

export const saveDraft = async (draft: Draft, id: string): Promise<string> => {
    return db.draft.put(draft, id);
};

export const removeDraft = async (id: string): Promise<void> => {
    return db.draft.delete(id);
};