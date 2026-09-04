<template>
    <section class="note-list">
        <div class="container">
            <p v-if="!preparedNotes.length">Заметок нет</p>
            <ul class="note-list__inner" v-else>
                <li class="note-list__item" v-for="el in preparedNotes" :key="el.id">
                    <NoteCard
                        :note="el"
                        :removing="removingId === el.id"
                        @remove="onRemove(el.id)"/>
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { type Note } from "~/types/note";

    import { useNotesStore } from "~/stores/notes";
    import { storeToRefs } from 'pinia';
    import { computed, ref } from "vue";

    import NoteCard from "~/components/NoteCard.vue";

    import { dialog } from '~/services/dialogService';


    const notesStore = useNotesStore();
    const { notes } = storeToRefs(notesStore);
    const { remove } = notesStore;
    const removingId = ref<string | null>(null);

    const preparedNotes = computed<Note[]>(() => {
        return notes.value.map(el => ({
            ...el,
            todos: el.todos.slice(0, 6),
        }));
    });

    const onRemove = async (id: string) => {
        if (removingId.value) return;

        removingId.value = id;

        try {
            const confirmed = await dialog({
                title: "Удалить заметку?",
                text: "Данные будут удалены окончательно",
                buttons: [
                    { title: "Отмена", value: false },
                    { title: "Подтвердить", variant: "outline", value: true },
                ],
            });

            if (confirmed) {
                await remove(id);
            }
        } catch (error) {
            console.error(error);

            await dialog({
                title: "Не удалось удалить заметку",
                text: "Попробуйте ещё раз",
                buttons: [
                    {
                        title: "Ок",
                        value: null,
                    },
                ],
            });
        } finally {
            removingId.value = null;
        }
    };
</script>

<style scoped lang="scss">
    .note-list {
        &__inner {
            display: grid;
            gap: 1.875rem;
        }
    }
</style>
