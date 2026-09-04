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
                        :disabled="isProcessing"
                        @focus="onFocus"
                        @blur="onBlur"
                        ref="fieldComponent"
                        >
                    </Field>
                    <Button 
                        iconOnly 
                        @click="onUndo" 
                        :disabled="isProcessing || !canUndo"
                        ariaLabel="Назад">
                        <Undo />
                    </Button>
                    <Button 
                        iconOnly 
                        @click="onRedo"
                        :disabled="isProcessing || !canRedo"
                        ariaLabel="Вперед">
                        <Redo />
                    </Button>
                </div>
                <div class="note-edit__middle">
                    <TodoList 
                        v-model="note.todos"
                        :disabled="isProcessing"
                        @toggle="onTodoToggle"
                        @add="onTodoAdd"
                        @remove="onTodoRemove"
                        @changeText="onChangeTodoText"
                    />
                </div>
                <div class="note-edit__actions">
                    <Button 
                        @click="onSave"
                        :disabled="isProcessing">
                        Сохранить изменения
                    </Button>
                    <Button
                        @click="onCancelEdit"
                        :disabled="isProcessing"
                        variant="outline" 
                        v-if="!isNew">
                        Отменить редактирование
                    </Button>
                    <Button 
                        @click="onRemove"
                        :disabled="isProcessing"
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
    const isProcessing = ref(false);

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

    const prepareNote = (source: Note): Note => {
        const preparedNote = structuredClone(toRaw(source));

        preparedNote.todos = preparedNote.todos.filter(
            todo => !!todo.text.trim(),
        );

        return preparedNote;
    };

    const finishEditing = async () => {
        await discardDraft();
        clearHistory();
        await navigateTo("/");
    };

    const showOperationError = async (title: string) => {
        await dialog({
            title,
            text: "Попробуйте ещё раз",
            buttons: [
                {
                    title: "Ок",
                    value: null,
                },
            ],
        });
    };

    const onSave = async () => {
        const currentNote = note.value;
        const noteId = id.value;

        if (
            !currentNote ||
            noteId == null ||
            isProcessing.value
        ) {
            return;
        }

        if (!currentNote.title.trim()) {
            dirty.value = true;
            fieldComponent.value?.focus();

            return;
        }

        isProcessing.value = true;

        try {
            const preparedNote = prepareNote(currentNote);

            if (isNew.value) {
                await create(preparedNote);
            } else {
                const updated = await update(
                    noteId,
                    preparedNote,
                );

                if (!updated) {
                    await dialog({
                        title: "Заметка удалена",
                        text: "Эта заметка была удалена в другой вкладке",
                        buttons: [
                            {
                                title: "Ок",
                                value: null,
                            },
                        ],
                    });

                    await finishEditing();

                    return;
                }
            }

            await finishEditing();
        } catch (error) {
            console.error(error);

            await showOperationError("Не удалось сохранить заметку");
        } finally {
            isProcessing.value = false;
        }
    };

    const onCancelEdit = async () => {
        if (isProcessing.value) return;

        isProcessing.value = true;

        try {
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

            await finishEditing();

        } catch (error) {
            
            console.error(error);

            await showOperationError("Не удалось отменить редактирование");
        } finally {
            isProcessing.value = false;
        }
    };

    const onRemove = async () => {
        const noteId = id.value;

        if (
            isNew.value ||
            noteId == null ||
            isProcessing.value
        ) {
            return;
        }

        isProcessing.value = true;

        try {
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

            await remove(noteId);

            await finishEditing();

        } catch (error) {
            
            console.error(error);

            await showOperationError("Не удалось удалить заметку");
        } finally {
            isProcessing.value = false;
        }
    };

    useSyncLayer(
        isNew,
        id,
        async () => {
            await discardDraft();
            clearHistory();
        },
    );


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

        @media (width <= 700px) {
            &__top {
                gap: 0.75rem;
            }

            &__actions {
                flex-direction: column;

                .button {
                    width: 100%;
                    justify-content: center;
                }
            }
        }
    }
</style>
