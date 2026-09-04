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
    import { computed, ref, watch } from "vue";
    import { setDialogFn, type DialogOptions, type DialogResult } from "~/services/dialogService";

    import Modal from "~/components/Modal.vue";
    import Button from "~/components/Button.vue";

    const options = ref<DialogOptions | null>(null);
    const showModal = ref<boolean>(false);
    let resolveDialog: ((value: DialogResult) => void) | null = null;

    const buttons = computed(() => options.value?.buttons ?? [
        {
            title: "Cancel",
            variant: "outline" as const,
            value: null,
        },
    ]);

    const finishDialog = (value: DialogResult) => {
        const resolve = resolveDialog;

        if (!resolve) return;

        resolveDialog = null;
        resolve(value);

        options.value = null;
        showModal.value = false;
    };

    setDialogFn((dialogOptions) => {
        finishDialog(null);

        options.value = dialogOptions;
        showModal.value = true;

        return new Promise<DialogResult>((resolve) => {
            resolveDialog = resolve;
        });
    });

    watch(showModal, (isOpen) => {
        if (!isOpen) {
            finishDialog(null);
        }
    });

    const handleButtonClick = (value: DialogResult) => {
        finishDialog(value);
    };
</script>
