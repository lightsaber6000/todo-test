export type Todo = {
    id: string;
    text: string;
    complete: boolean;
};

export type Note = {
    id: string;
    title: string;
    todos: Todo[];
    revision: number;
};

export type Draft = {
    noteId: string;
    note: Note;
    baseRevision: number;
};

export type Metadata = {
    key: string;
    schemaVersion: number;
};