type NoteContent = {
    title: string;
    todos: Todo[];
};

export type Todo = {
    id: number;
    text: string;
    complete: boolean;
};

export type Note = NoteContent & {
    id: string;
    revision: number;
};

export type Draft = NoteContent & {
    noteId: string;
    baseRevision: number;
};

export type Metadata = {
    key: string;
    schemaVersion: number;
};