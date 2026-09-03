import { db } from "@/db/db";
import type { Metadata } from "@/types/note";

export const getMetadata = async (): Promise<Metadata | undefined> => {
    return db.metadata.get("app");
};