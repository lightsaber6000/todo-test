<template>
  <NuxtPage />
</template>

<script setup lang="ts">
    import { useNotesStore } from "~/stores/notes";

    const notesStore = useNotesStore();

    await callOnce('notes-hydrate', notesStore.hydrate);
</script>

<style lang="scss"> 
  @use "~/assets/styles/main.scss";
</style>