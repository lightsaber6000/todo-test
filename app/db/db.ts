import { Dexie, type EntityTable } from "dexie"
import type { Note, Draft, Metadata } from "@/db/schema";

const db = new Dexie("InterviewDatabase") as Dexie & {
    note: EntityTable<
        Note, "id"
    >,
    draft: EntityTable<
        Draft, "noteId"
    >,
    metadata: EntityTable<
        Metadata, "key"
    >
}

db.version(1).stores({
    note: "id",
    draft: "noteId",
    metadata: "key",
});

export { db };