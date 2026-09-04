import { describe, expect, it } from "vitest";
import { useHistory } from "~/composables/useHistory";
import type { Note, Todo } from "~/types/note";

const makeNote = (): Note => ({
    id: "note-1",
    title: "Исходный заголовок",
    todos: [
        { id: "todo-1", text: "Первая задача", complete: false },
        { id: "todo-2", text: "Вторая задача", complete: true },
    ],
});

describe("useHistory", () => {
    it("отмена и повтор изменения заголовка", () => {
        const note = makeNote();
        const { push, undo, redo, canRedo } = useHistory();

        note.title = "Изменённый заголовок";
        push({
            type: "changeTitle",
            oldValue: "Исходный заголовок",
            newValue: "Изменённый заголовок",
        });

        undo(note);
        expect(note.title).toBe("Исходный заголовок");
        expect(canRedo.value).toBe(true);

        redo(note);
        expect(note.title).toBe("Изменённый заголовок");
    });

    it("отмена и повтор изменения текста задачи", () => {
        const note = makeNote();
        const { push, undo, redo } = useHistory();

        note.todos[0]!.text = "Изменённая задача";
        push({
            type: "changeTodoText",
            id: "todo-1",
            oldValue: "Первая задача",
            newValue: "Изменённая задача",
        });

        undo(note);
        expect(note.todos[0]!.text).toBe("Первая задача");

        redo(note);
        expect(note.todos[0]!.text).toBe("Изменённая задача");
    });

    it("отмена и повтор изменения статуса задачи", () => {
        const note = makeNote();
        const { push, undo, redo } = useHistory();

        note.todos[0]!.complete = true;
        push({
            type: "toggleTodo",
            id: "todo-1",
            oldValue: false,
            newValue: true,
        });

        undo(note);
        expect(note.todos[0]!.complete).toBe(false);

        redo(note);
        expect(note.todos[0]!.complete).toBe(true);
    });

    it("отмена и повтор добавления задачи", () => {
        const note = makeNote();
        const { push, undo, redo } = useHistory();
        const todo: Todo = {
            id: "todo-3",
            text: "Третья задача",
            complete: false,
        };

        note.todos.push(todo);
        push({ type: "addTodo", todo, index: 2 });
        undo(note);
        expect(note.todos.map(todo => todo.id)).toEqual(["todo-1", "todo-2"]);

        redo(note);
        expect(note.todos[2]).toEqual(todo);
    });

    it("отмена и повтор удаление задачи", () => {
        const note = makeNote();
        const { push, undo, redo } = useHistory();
        const todo = note.todos[0]!;

        note.todos.splice(0, 1);
        push({ type: "removeTodo", todo, index: 0 });

        undo(note);
        expect(note.todos.map(todo => todo.id)).toEqual(["todo-1", "todo-2"]);

        redo(note);
        expect(note.todos.map(todo => todo.id)).toEqual(["todo-2"]);
    });

    it("очистка истории повтора после новой операции", () => {
        const note = makeNote();
        const { push, undo, redo, canRedo } = useHistory();

        note.title = "Первое изменение";
        push({
            type: "changeTitle",
            oldValue: "Исходный заголовок",
            newValue: "Первое изменение",
        });
        undo(note);

        note.title = "Новая ветка";
        push({
            type: "changeTitle",
            oldValue: "Исходный заголовок",
            newValue: "Новая ветка",
        });

        expect(canRedo.value).toBe(false);
        redo(note);
        expect(note.title).toBe("Новая ветка");
    });

    it("хранение не более 50 операций", () => {
        const note = makeNote();
        const { push, undo, canUndo } = useHistory();

        for (let index = 1; index <= 51; index++) {
            const oldValue = note.title;
            const newValue = `Заголовок ${index}`;

            note.title = newValue;
            push({ type: "changeTitle", oldValue, newValue });
        }

        for (let index = 0; index < 50; index++) {
            undo(note);
        }

        expect(note.title).toBe("Заголовок 1");
        expect(canUndo.value).toBe(false);
    });
});
