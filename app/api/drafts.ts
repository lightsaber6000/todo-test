import { db } from "@/db/db";
import type { Draft } from "@/db/schema";

export const getDraft = async (id: string): Promise<Draft | undefined> => {
    return db.draft.get(id);
};

export const createDraft = async (draft: Draft): Promise<string> => {
    return db.draft.add(draft);
};

export const updateDraft = async (id: string, draft: Partial<Draft>): Promise<number> => {
    return db.draft.update(id, draft);
};