<template>
  <NuxtPage />
  <Dialog />
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted } from "vue";
    import { useNotesStore } from "~/stores/notes";
    import { subscribeNotesSync } from "~/services/notesSync";
    import Dialog from "~/components/Dialog.vue";

    const notesStore = useNotesStore();

    await callOnce("notes-hydrate", notesStore.hydrate);

    let unsubscribeNotesSync: (() => void) | null = null;

    onMounted(() => {
        unsubscribeNotesSync = subscribeNotesSync(message => {
            if (message.type === "note-deleted") {
                notesStore.removeLocal(message.id);
            }
        });
    });

    onUnmounted(() => {
        unsubscribeNotesSync?.();
    });
</script>

<style lang="scss"> 
  @use "~/assets/styles/main.scss";
</style>