import { db } from "@/db/db";
import type { Metadata } from "@/types/note";

const schemaVersion = 1;

export const getMetadata = async (): Promise<Metadata | undefined> => {
    return db.metadata.get("app");
};

export const initMetadata = async (): Promise<void> => {
    // Чтение и запись объединены в транзакцию, чтобы при одновременном первом
    // запуске в двух вкладках обе не пытались создать один и тот же ключ metadata.
    await db.transaction("rw", db.metadata, async () => {
        const metadata = await db.metadata.get("app");

        if (metadata) return;

        await db.metadata.put({
            key: "app",
            schemaVersion,
        });
    });
};
