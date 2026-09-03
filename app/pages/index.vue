<template>
    <main>
        <section class="main-header">
            <div class="container">
                <Button>Создать заметку</Button>
            </div>
        </section>
        <section class="notes-list">
            <div class="container">

            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
    import Button from '~/components/Button.vue';
    import { useNotesStore } from "~/stores/notes";

    const notesStore = useNotesStore();

    notesStore.hydrate();
</script>

<style lang="scss"> 
    @use "~/assets/styles/pages/index.scss";
</style>
