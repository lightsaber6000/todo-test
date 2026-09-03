import type { Todo } from "~/types/note";

export type ChangeTitle = {
    type: "changeTitle";
    oldValue: string;
    newValue: string;
}

export type ChangeTodoText = {
    type: "changeTodoText";
    id: string;
    oldValue: string;
    newValue: string;
}

export type ToggleTodo = {
    type: "toggleTodo";
    id: string;
    oldValue: boolean;
    newValue: boolean;
}

export type AddTodo = {
    type: "addTodo";
    index: number;
    todo: Todo;
}

export type RemoveTodo = {
    type: "removeTodo";
    index: number;
    todo: Todo;
}

export type Operation =
    ChangeTitle
    | ChangeTodoText
    | ToggleTodo
    | AddTodo
    | RemoveTodo;