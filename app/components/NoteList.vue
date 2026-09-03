<template>
    <section class="note-list">
        <div class="container">
            <p v-if="!preparedNotes.length">Заметок нет</p>
            <ul class="note-list__inner" v-else>
                <li class="note-list__item" v-for="el in preparedNotes" :key="el.id">
                    <NoteCard :note="el"/>
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { type Note } from "~/types/note";

    import { useNotesStore } from "~/stores/notes";
    import { storeToRefs } from 'pinia';
    import { computed } from "vue";

    import NoteCard from "~/components/NoteCard.vue";

    const notesStore = useNotesStore();

    const { notes } = storeToRefs(notesStore);

    const preparedNotes = computed<Note[]>(() => {
        return notes.value.map(el => ({
            ...el,
            todos: el.todos.slice(0, 6),
        }));
    });
</script>

<style scoped lang="scss">
    .note-list {
        &__inner {
            display: grid;
            gap: 50px;
        }
    }
</style>