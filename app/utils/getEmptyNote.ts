import { type Note } from "~/types/note";

const getEmptyNote = (): Note => ({
    id: crypto.randomUUID(),
    title: '',
    todos: [],
    revision: 0,
});

export default getEmptyNote;