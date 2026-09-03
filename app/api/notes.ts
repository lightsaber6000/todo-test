import { db } from "@/db/db";
import type { Note } from "@/db/schema";

export const getNoteList = async (): Promise<Note[]> => {
    return db.note.toArray();
};

export const getNote = async (id: string): Promise<Note | undefined> => {
    return db.note.get(id);
};

export const createNote = async (note: Note): Promise<string> => {
    return db.note.add(note);
};

export const updateNote = async (id: string, note: Partial<Note>): Promise<number> => {
    return db.note.update(id, note);
};