import { db } from "@/db/db";
import type { Metadata } from "@/db/schema";

export const getMetadata = async (): Promise<Metadata | undefined> => {
    return db.metadata.get("app");
};