<template>
    <main class="main">
        <section class="note-edit" v-if="note">
            <div class="container note-edit__container">
                <div class="note-edit__top">
                    <Field 
                        name="name"
                        v-model="note.title"
                        label="Название заметки" 
                        class="note-edit__name"></Field>
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
                    <Button>Сохранить изменения</Button>
                    <Button variant="outline">Отменить редактирование</Button>
                    <Button variant="danger">Удалить</Button>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
    import { type Note } from "~/types/note";

    import { useNotesStore } from "~/stores/notes";
    import { Undo, Redo } from '@lucide/vue';
    import Field from "~/components/Field.vue";
    import Button from "~/components/Button.vue";
    import TodoList from "~/components/TodoList.vue";

    import getEmptyNote from '~/utils/getEmptyNote';

    const route = useRoute();
    const notesStore = useNotesStore();
    const note = ref<Note | null>(null);
  
    const { get } = notesStore;

    if (route.params.id === 'new') {
        note.value = getEmptyNote();
    } else {
        const storedNote = await get(String(route.params.id));

        if (!storedNote) {
            console.log('тост + редирект');
            await navigateTo('/');
        } else {
            note.value = structuredClone(toRaw(storedNote));
        }
    }
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