import { ref, computed, toRaw } from "vue";
import type { Note } from "~/types/note";
import type { Operation } from "~/types/history";

const historyLimit = 50;

export const useHistory = () => {
    let undoStack = ref<Operation[]>([]);
    let redoStack = ref<Operation[]>([]);

    const applyOperation = (
        note: Note,
        operation: Operation,
        type: "undo" | "redo",
    ) => {
        const isUndo = type === "undo";

        switch (operation.type) {
            case "changeTitle":
                note.title = isUndo
                    ? operation.oldValue
                    : operation.newValue;
                break;

            case "changeTodoText": {
                const todo = note.todos.find(el => el.id === operation.id);

                if (todo) {
                    todo.text = isUndo
                        ? operation.oldValue
                        : operation.newValue;
                }

                break;
            }

            case "toggleTodo": {
                const todo = note.todos.find(el => el.id === operation.id);

                if (todo) {
                    todo.complete = isUndo
                        ? operation.oldValue
                        : operation.newValue;
                }

                break;
            }

            case "addTodo":
                if (isUndo) {
                    note.todos.splice(operation.index, 1);
                } else {
                    note.todos.splice(
                        operation.index,
                        0,
                        structuredClone(toRaw(operation.todo)),
                    );
                }
                break;

            case "removeTodo":
                if (isUndo) {
                    note.todos.splice(
                        operation.index,
                        0,
                        structuredClone(toRaw(operation.todo)),
                    );
                } else {
                    note.todos.splice(operation.index, 1);
                }
                break;
        }
    };

    const push = (op: Operation) => {
        undoStack.value.push(op);

        if (undoStack.value.length > historyLimit) {
            undoStack.value.shift();
        }

        redoStack.value = [];
    };

    const undo = (note: Note) => {
        const operation = undoStack.value.pop();

        if (!operation) return;

        applyOperation(note, operation, "undo");
        redoStack.value.push(operation);
    };

    const redo = (note: Note) => {
        const operation = redoStack.value.pop();

        if (!operation) return;

        applyOperation(note, operation, "redo");
        undoStack.value.push(operation);
    };

    const clear = () => {
        undoStack.value = [];
        redoStack.value = [];
    };

    const canUndo = computed(() => !!undoStack.value.length);

    const canRedo = computed(() => !!redoStack.value.length);

    return {
        canRedo,
        canUndo,
        clear,
        redo,
        undo,
        push,
    };
};