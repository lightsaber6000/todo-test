<template>
    <div class="modal" role="presentation" v-if="modelValue">
        <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <h3 id="modal-title" class="modal__title text-medium">{{ title }}</h3>
            <p class="modal__text" v-if="text">{{ text }}</p>
            <div v-if="$slots.default" class="modal__actions">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        title: string;
        text?: string;
    }>();

    const modelValue = defineModel<boolean>("modelValue", {
        required: true,
    });
</script>

<style lang="scss">
    .modal {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: var(--color-overlay);

        &__dialog {
            width: 100%;
            max-width: 460px;
            padding: 28px;
            border: 1px solid var(--color-line);
            border-radius: 20px;
            background: var(--color-bg);
            box-shadow: var(--shadow-lg);
        }

        &__title { 
            margin: 0 0 18px;
            font-weight: 600;
        }
        &__body { 
            margin: 0 0 22px; 
            color: var(--color-text-40); 
            white-space: pre-line;
        }
        &__actions { 
            display: flex; 
            justify-content: flex-end; 
            gap: 10px; 
            flex-wrap: wrap; 
            margin-top: 22px;
        }
    }
</style>