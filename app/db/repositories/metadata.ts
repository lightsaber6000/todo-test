import { db } from "@/db/db";
import type { Metadata } from "@/types/note";

const schemaVersion = 1;

export const getMetadata = async (): Promise<Metadata | undefined> => {
    return db.metadata.get("app");
};

export const initMetadata = async (): Promise<void> => {
    const metadata = await getMetadata();

    if (metadata) return;

    await db.metadata.add({
        key: "app",
        schemaVersion,
    });
};