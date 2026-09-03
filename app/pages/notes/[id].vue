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
                        :formDirty="dirty"
                        v-model="note.title"
                        ref="fieldComponent"
                        >
                    </Field>
                    <Button iconOnly ariaLabel="Назад">
                        <Undo />
                    </Button>
                    <Button iconOnly ariaLabel="Вперед">
                        <Redo />
                    </Button>
                </div>
                <div class="note-edit__middle">
                    <TodoList v-model="note.todos" />
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
    import { type Note } from "~/types/note";

    import { useNotesStore } from "~/stores/notes";
    import { Undo, Redo } from '@lucide/vue';
    import { computed, toRaw } from 'vue';
    import Field from "~/components/Field.vue";
    import Button from "~/components/Button.vue";
    import TodoList from "~/components/TodoList.vue";

    import getEmptyNote from '~/utils/getEmptyNote';
    import { dialog } from '~/services/dialogService';

    const route = useRoute();
    const notesStore = useNotesStore();
    const note = ref<Note | null>(null);
    const dirty = ref(false);
    const notFound = ref(false);
    const fieldComponent = ref<typeof Field | null>(null);
  
    const { get, create, remove, update } = notesStore;

    const isNew = computed(() => route.params.id === 'new');
    const id = computed(() => {
        const value = route.params.id;
        return Array.isArray(value) ? value[0] : value;
    });

    if (isNew.value) {
        note.value = getEmptyNote();
    } else {
        const storedNote = await get(id.value!);
        if (!storedNote) {
           notFound.value = true;
        } else {
           note.value = structuredClone(toRaw(storedNote));
        }
    }

    onMounted(async () => {
        if (!notFound.value) return;

        await dialog({
            title: "Страница не найдена",
            buttons: [
                { title: "Ок", value: false },
            ],
        });

        await navigateTo("/");
    });

    const onSave = () => {
        if (id.value == null) return;

        const preparedNote: Note = toRaw(note.value!);
        preparedNote.todos = preparedNote.todos.filter(el => !!el.text);

        if (note.value?.title?.trim?.()) {
            if (isNew.value) create(toRaw(note.value));
            else update(id.value, toRaw(note.value));
            navigateTo('/');
        } else {
            dirty.value = true;
            fieldComponent?.value?.focus();
        }
    };

    const onCancelEdit = async () => {
        const confirmed = await dialog({
            title: "Отменить редактирование?",
            text: "Все внесенные изменения будут удалены",
            buttons: [
                { title: "Отмена", value: false },
                { title: "Подтвердить", variant: "outline", value: true },
            ],
        });

        if (confirmed) {
            navigateTo('/');
        }
    };

    const onRemove = async () => {
        if (isNew.value || id.value == null) return;

        const confirmed = await dialog({
            title: "Удалить заметку?",
            text: "Данные будут удалены окончательно",
            buttons: [
                { title: "Отмена", value: false },
                { title: "Подтвердить", variant: "outline", value: true },
            ],
        });

        if (confirmed) {
            remove(id.value)
            navigateTo('/');
        }
    };
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