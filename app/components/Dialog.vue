<template>
    <Modal v-model="showModal" 
           :title="options?.title ?? ''"
           :text="options?.text ?? ''">
        <Button
            v-for="(button, index) in buttons"
            :key="index"
            :variant="button.variant"
            @click="handleButtonClick(button.value)"
        >
            {{ button.title }}
        </Button>
    </Modal>
</template>

<script setup lang="ts">
    import { computed, ref } from "vue";
    import { setDialogFn, type DialogOptions, type DialogResult } from "~/services/dialogService";

    import Modal from "~/components/Modal.vue";
    import Button from "~/components/Button.vue";

    const options = ref<DialogOptions | null>(null);
    let showModal = ref<boolean>(false);
    let resolveDialog: ((value: DialogResult) => void) | null = null;

    const buttons = computed(() => options.value?.buttons ?? [
        {
            title: "Cancel",
            variant: "outline" as const,
            value: null,
        },
    ]);

    setDialogFn((dialogOptions) => {
        options.value = dialogOptions;
        showModal.value = true;

        return new Promise<DialogResult>((resolve) => {
            resolveDialog = resolve;
        });
    });

    const handleButtonClick = (value: DialogResult) => {
        resolveDialog?.(value);

        options.value = null;
        showModal.value = false;
        resolveDialog = null;
    };
</script>