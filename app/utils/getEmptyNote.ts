import { type Note } from "~/types/note";

const getEmptyNote = (): Note => ({
    id: crypto.randomUUID(),
    title: '',
    todos: [],
});

export default getEmptyNote;