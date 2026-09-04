<template>
    <div 
        v-if="modelValue"
        ref="modalNode"
        class="modal"
        role="presentation"
        @keydown="navigationByKeyboard"
        @click.self="close"
    >
        <div
            class="modal__dialog"
            role="dialog"
            aria-modal="true"
            tabindex="0"
            :aria-labelledby="`modal-${id}-title`"
        >
            <div class="modal__body">
                <h3 :id="`modal-${id}-title`" class="modal__title">{{ title }}</h3>
                <p class="modal__text" v-if="text">{{ text }}</p>
            </div>

            <div v-if="$slots.default" class="modal__actions">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { nextTick, onUnmounted, useId, ref, watch } from "vue";

    const props = defineProps<{
        title: string;
        text?: string;
    }>();

    const modelValue = defineModel<boolean>("modelValue", {
        required: true,
    });

    const id = useId();
    const modalNode = ref<HTMLElement | null>(null);
    let previouslyFocusedElement: HTMLElement | null = null;

    const close = () => {
        modelValue.value = false;
    };

    const getFocusableElements = (): HTMLElement[] => {
        if (!modalNode.value) {
            return [];
        }

        return Array.from(
            modalNode.value.querySelectorAll<HTMLElement>(
                [
                    "a[href]",
                    "button:not([disabled])",
                    "input:not([disabled])",
                    "select:not([disabled])",
                    "textarea:not([disabled])",
                    '[tabindex]:not([tabindex="-1"])',
                ].join(","),
            ),
        );
    };

    const navigationByKeyboard = (event: KeyboardEvent) => {
        switch (event.key) {
            case "Tab": {
                if (!modalNode.value) break;

                const focusableElements = getFocusableElements();

                if (!focusableElements.length) break;

                const firstElement = focusableElements[0]!;
                const lastElement = focusableElements[focusableElements.length - 1]!;

                if (!event.shiftKey && lastElement === document.activeElement) {
                    event.preventDefault();
                    firstElement.focus();
                } else if (event.shiftKey && firstElement === document.activeElement) {
                    event.preventDefault();
                    lastElement.focus();
                }

                break;
            }

            case "Escape":
                close();
                break;

            default:
                break;
        }
    };

    watch(modelValue, async (isOpen) => {
        document.body.classList.toggle('is-blocked', isOpen);

        if (isOpen) {
            previouslyFocusedElement = document.activeElement as HTMLElement | null;

            await nextTick();

            const focusableElements = getFocusableElements();

            focusableElements[0]?.focus();

            return;
        }

        previouslyFocusedElement?.focus();
        previouslyFocusedElement = null;
    });

    onUnmounted(() => {
        document.body.classList.remove('is-blocked');
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
            background: var(--color-bg);
            box-shadow: var(--shadow-lg);
            &:focus-visible {
                outline: none;
            }
        }

        &__body {
            margin-bottom: 3.125rem;   
        }

        &__title { 
            margin: 0 0 18px;
            font-weight: 600;
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
