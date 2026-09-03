import { type Todo } from "~/types/note";

const getEmptyTodo = (): Todo => ({
    id: crypto.randomUUID(),
    text: '',
    complete: false,
});

export default getEmptyTodo;