<template>
    <div class="form-checkbox">
        <input
            type="checkbox"
            class="form-checkbox__input"
            v-model="modelValue"
            :aria-label="ariaLabel"
            :id="id"
            :name="props.name"
            :disabled="props.disabled"
        />
    </div>
</template>

<script setup lang="ts">
    import { useId } from "vue";

    const props = defineProps<{
        ariaLabel: string;
        name: string;
        disabled?: boolean;
    }>();

    const id = useId();

    const modelValue = defineModel<boolean>("modelValue", {
        required: true,
    })
</script>

<style lang="scss">
    .form-checkbox {
        position: relative;
        display: grid;
        grid-template-columns: 18px minmax(0, 1fr);
        align-items: flex-start;
        gap: .75rem;

        &::before {
            grid-column: 1;
            grid-row: 1;
            width: 18px;
            height: 18px;
            margin: .15em 0 0;
            background: transparent;
            border: 1px solid var(--color-line-strong);
            content: "";
            transition:
                background-color var(--dur-1) var(--ease),
                border-color var(--dur-1) var(--ease);
        }

        &::after {
            content: "";
            position: absolute;
            top: calc(.15em + 4px);
            left: 4px;
            width: 10px;
            height: 10px;
            background: var(--color-accent-text);
            clip-path: polygon(14% 44%, 0 59%, 40% 100%, 100% 20%, 84% 6%, 39% 72%);
            pointer-events: none;
            transform: scale(0);
            transition: transform var(--dur-1) var(--ease);
        }

        &:has(&__input:checked) {
            &::before {
                background: var(--color-accent);
                border-color: var(--color-accent);
            }

            &::after {
                transform: scale(1);
            }
        }

        &:has(&__input:focus-visible)::before {
            outline: 2px solid var(--color-accent);
            outline-offset: 3px;
        }

        &:has(&__input:disabled) {
            .form-checkbox {
                &__label {
                    cursor: not-allowed;
                    opacity: .55;
                }
            }
        }

        &__input {
            cursor: pointer;
            position: absolute;
            inset: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
            margin: 0;
            opacity: 0;

            &:disabled {
                cursor: not-allowed;
            }

            &:focus-visible {
                outline: none;
            }
        }

        &__text {
            grid-column: 2;
            grid-row: 1;
            font-size: .9rem;
        }

        &__label {
            cursor: pointer;
        }

        .link {
            position: relative;
            z-index: 2;
        }
    }
</style>
