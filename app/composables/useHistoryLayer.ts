import { onMounted, onUnmounted } from "vue";
import type { Note, Todo } from "~/types/note";
import { useHistory } from "~/composables/useHistory";

export const useHistoryLayer = (note: Ref<Note | null>) => {
    const {
        canRedo,
        canUndo,
        clear,
        redo,
        undo,
        push,
    } = useHistory();

    let titleBeforeEdit = "";

    const onUndo = () => {
        if (note.value == null) return;

        undo(note.value);
    };

    const onRedo = () => {
        if (note.value == null) return;

        redo(note.value);
    };

    const onTodoToggle = (
        id: string,
        oldValue: boolean,
        newValue: boolean,
    ) => {
        push({
            type: "toggleTodo",
            id,
            oldValue,
            newValue,
        });
    };

    const onTodoAdd = (index: number, todo: Todo) => {
        push({
            type: "addTodo",
            index,
            todo,
        });
    };

    const onTodoRemove = (index: number, todo: Todo) => {
        push({
            type: "removeTodo",
            index,
            todo,
        });
    };

    const onChangeTodoText = (
        id: string,
        oldValue: string,
        newValue: string,
    ) => {
        push({
            type: "changeTodoText",
            id,
            oldValue,
            newValue,
        });
    };

    const onFocus = () => {
        titleBeforeEdit = note.value?.title ?? "";
    };

    const onBlur = () => {
        if (
            note.value == null ||
            titleBeforeEdit === note.value.title
        ) {
            return;
        }

        push({
            type: "changeTitle",
            oldValue: titleBeforeEdit,
            newValue: note.value.title,
        });

        titleBeforeEdit = "";
    };

    const historyHotkeyHandle = (event: KeyboardEvent) => {
        const isUndoHotkey = event.ctrlKey && !event.shiftKey && event.code === "KeyZ";
        const isRedoHotkey = event.ctrlKey && event.shiftKey && event.code === "KeyZ";

        const isTextInput =
            event.target instanceof HTMLInputElement &&
            event.target.type !== "checkbox";

        if (isTextInput || note.value == null) return;

        if (isUndoHotkey || isRedoHotkey) {
            event.preventDefault();
        }

        if (isUndoHotkey && canUndo.value) {
            undo(note.value);
        }

        if (isRedoHotkey && canRedo.value) {
            redo(note.value);
        }
    };

    onMounted(() => {
        document.addEventListener("keydown", historyHotkeyHandle);
    });

    onUnmounted(() => {
        document.removeEventListener("keydown", historyHotkeyHandle);
    });

    return {
        canRedo,
        canUndo,

        onBlur,
        onFocus,
        onChangeTodoText,
        onTodoRemove,
        onTodoAdd,
        onTodoToggle,
        onUndo,
        onRedo,

        clearHistory: clear,
    };
};