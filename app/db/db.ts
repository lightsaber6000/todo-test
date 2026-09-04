import { Dexie, type EntityTable } from "dexie"
import type { Note, Metadata } from "@/types/note";

const db = new Dexie("InterviewDatabase") as Dexie & {
    note: EntityTable<
        Note, "id"
    >,
    metadata: EntityTable<
        Metadata, "key"
    >
}

db.version(1).stores({
    note: "id",
    metadata: "key",
});

export { db };
