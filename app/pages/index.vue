<template>
    <main class="main">
        <section class="main-actions">
            <div class="container main-actions__inner">
                <Button>Создать заметку</Button>
            </div>
        </section>
        <NoteList />
    </main>
</template>

<script setup lang="ts">
    import Button from '~/components/Button.vue';
    import NoteList from '~/components/NoteList.vue';
    import { useNotesStore } from "~/stores/notes";

    const notesStore = useNotesStore();

    notesStore.hydrate();
</script>

<style lang="scss"> 
    @use "~/assets/styles/pages/index.scss";

    .main-actions {
        margin-bottom: 2.5rem;
        &__inner {
            display: flex;
            justify-content: flex-end;
            flex-grow: 1;
        }
    }
</style>
