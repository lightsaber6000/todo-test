<template>
    <main class="main">
        <section class="note-edit" v-if="note">
            <div class="container note-edit__container">
                <div class="note-edit__top">
                    <Field 
                        required
                        requiredLabel="Название должно быть заполнено"
                        name="name"
                        label="Название заметки" 
                        class="note-edit__name"
                        v-model="note.title"
                        :formDirty="dirty"
                        @focus="onFocus"
                        @blur="onBlur"
                        ref="fieldComponent"
                        >
                    </Field>
                    <Button 
                        iconOnly 
                        @click="onUndo" 
                        :disabled="!canUndo"
                        ariaLabel="Назад">
                        <Undo />
                    </Button>
                    <Button 
                        iconOnly 
                        @click="onRedo"
                        :disabled="!canRedo"
                        ariaLabel="Вперед">
                        <Redo />
                    </Button>
                </div>
                <div class="note-edit__middle">
                    <TodoList 
                        v-model="note.todos"
                        @toggle="onTodoToggle"
                        @add="onTodoAdd"
                        @remove="onTodoRemove"
                        @changeText="onChangeTodoText"
                    />
                </div>
                <div class="note-edit__actions">
                    <Button 
                        @click="onSave">
                        Сохранить изменения
                    </Button>
                    <Button
                        @click="onCancelEdit" 
                        variant="outline" 
                        v-if="!isNew">
                        Отменить редактирование
                    </Button>
                    <Button 
                        @click="onRemove" 
                        variant="danger" 
                        v-if="!isNew">
                        Удалить
                    </Button>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
    import type { Note, Todo } from "~/types/note";

    import { computed, onMounted, ref, toRaw } from "vue";
    import { Undo, Redo } from "@lucide/vue";

    import Field from "~/components/Field.vue";
    import Button from "~/components/Button.vue";
    import TodoList from "~/components/TodoList.vue";

    import { useNotesStore } from "~/stores/notes";

    import { useHistoryLayer } from "~/composables/useHistoryLayer";
    import { useDraftLayer } from "~/composables/useDraftLayer";
    import { useSyncLayer } from "~/composables/useSyncLayer";

    import getEmptyNote from "~/utils/getEmptyNote";
    import { dialog } from "~/services/dialogService";

    const route = useRoute();

    const isNew = computed(() => route.params.id === "new");

    const id = computed(() => {
        const value = route.params.id;

        return Array.isArray(value)
            ? value[0]
            : value;
    });

    const note = ref<Note | null>(null);
    const dirty = ref(false);

    const fieldComponent = ref<typeof Field | null>(null);

    const notesStore = useNotesStore();

    const {
        get,
        create,
        remove,
        update,
    } = notesStore;


    const {
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
        clearHistory,
    } = useHistoryLayer(note);


    const {
        initDraft,
        discardDraft,
    } = useDraftLayer(
        isNew,
        id,
        note,
    );

    useSyncLayer(
        isNew,
        id,
        async () => {
            await discardDraft();
            clearHistory();
        },
    );

    const initEditor = async (): Promise<boolean> => {
        let initialNote: Note;

        if (isNew.value) {
            initialNote = getEmptyNote();
        } else {
            const storedNote = await get(id.value!);

            if (!storedNote) {
                await dialog({
                    title: "Страница не найдена",
                    buttons: [
                        {
                            title: "Ок",
                            value: false,
                        },
                    ],
                });

                await navigateTo("/");

                return false;
            }

            initialNote = structuredClone(
                toRaw(storedNote),
            );
        }

        await initDraft(initialNote);

        return true;
    };

    const onSave = async () => {
        if (!note.value || id.value == null) return;

        if (!note.value.title.trim()) {
            dirty.value = true;
            fieldComponent.value?.focus();

            return;
        }

        const preparedNote = structuredClone(
            toRaw(note.value),
        );

        preparedNote.todos = preparedNote.todos.filter(
            todo => !!todo.text.trim(),
        );

        if (isNew.value) {
            await create(preparedNote);
        } else {
            await update(
                id.value,
                preparedNote,
            );
        }

        await discardDraft();

        clearHistory();

        navigateTo("/");
    };

    const onCancelEdit = async () => {
        const confirmed = await dialog({
            title: "Отменить редактирование?",
            text: "Все внесенные изменения будут удалены",
            buttons: [
                {
                    title: "Отмена",
                    value: false,
                },
                {
                    title: "Подтвердить",
                    variant: "outline",
                    value: true,
                },
            ],
        });

        if (!confirmed) return;

        await discardDraft();

        clearHistory();

        navigateTo("/");
    };

    const onRemove = async () => {
        if (isNew.value || id.value == null) return;

        const confirmed = await dialog({
            title: "Удалить заметку?",
            text: "Данные будут удалены окончательно",
            buttons: [
                {
                    title: "Отмена",
                    value: false,
                },
                {
                    title: "Подтвердить",
                    variant: "outline",
                    value: true,
                },
            ],
        });

        if (!confirmed) return;

        await remove(id.value);

        await discardDraft();

        clearHistory();

        navigateTo("/");
    };


    onMounted(() => {
        initEditor();
    });
</script>

<style lang="scss">
    .note-edit {
        height: 100%;
        width: 100%;
        &__name {
            flex-grow: 1;
        }
        &__top {
            display: flex;
            gap: 1.25rem;
            margin-bottom: 2.5rem;
        }
        &__actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.625rem;
        }
        &__middle {
            flex-grow: 1;
            margin-bottom: 6.25rem;
        }
        &__container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
    }
</style>