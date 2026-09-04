export type Todo = {
    id: string;
    text: string;
    complete: boolean;
};

export type Note = {
    id: string;
    title: string;
    todos: Todo[];
};

export type Draft = {
    noteId: string;
    note: Note;
};

export type Metadata = {
    key: string;
    schemaVersion: number;
};