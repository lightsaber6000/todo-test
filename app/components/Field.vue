<template>
    <div :class="['form-group',
            props.disabled && 'is-disabled',
            showError && 'is-error',
        ]">    
        <div class="form-group__control">
            <slot name="prepend">
                <div class="form-group__prepend"></div>
            </slot>
            <div class="form-group__field">
                <input 
                    type="text" 
                    v-model="modelValue"
                    class="form-input form-group__input"
                    :name="name"
                    :placeholder="props.label"
                    :disabled="props.disabled"
                    :required="props.required"
                    :aria-label="props.label"
                    :aria-describedby="showError ? `${id}-message` : undefined"
                    @blur="onBlur">
            </div>
            <slot name="append">
                <div class="form-group__append"></div>
            </slot>
        </div>
        <div class="form-group__details" v-if="showError">
            <p class="form-group__message" aria-live="polite" :id="`${id}-message`">{{ requiredLabel || "Ошибка" }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, useId } from "vue";

    const props = defineProps<{
        label: string;
        name: string;
        formDirty?: boolean;
        required?: boolean;
        requiredLabel?: string;
        disabled?: boolean,
    }>();

    const isDirty = ref(false);
    const id = useId();

    const modelValue = defineModel<string>("modelValue", {
        required: true,
    })

    const isValid = computed(() =>
      !props.required || !!modelValue.value.trim()
    );

    const showError = computed(() =>
      !isValid.value && (props.formDirty || isDirty.value)
    );

    const onBlur = () => {
        isDirty.value = true;
    };
</script>

<style lang="scss">
    .form-group {
        position: relative;
        display: flex;
        gap: 1.25rem;

        &__details {
            margin-top: var(--space-1);
        }

        &__control {
            width: 100%;
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        &__field {
            flex-grow: 1;
        }

        &__message {
            color: var(--color-error);
            font-size: .75rem;
        }

        &:not(.is-error):not(.is-disabled) {
            .form-input:hover:not(:disabled):not(:focus) {
                border-color: var(--color-text);
            }
        }

        &:focus-within:not(.is-error):not(.is-disabled) {
            .form-input {
                border-color: var(--color-accent);
            }
        }

        &.is-error {
            .form-input {
                border-color: var(--color-error);
            }
        }

        &.is-disabled {
            cursor: not-allowed;

            .form-input {
                border-color: var(--color-line);
                color: var(--color-text-60);
                opacity: 0.55;
            }
        }
    }
    .form-input {
        width: 100%;
        padding: .7em 0;
        background: transparent;
        border: 0;
        border-bottom: 1px solid var(--color-line-strong);
        color: var(--color-text);
        font-family: var(--font-body);
        font-size: 1.05rem;
        transition:
            border-color var(--dur-1) var(--ease),
            color var(--dur-1) var(--ease),
            opacity var(--dur-1) var(--ease);

        &:focus {
            outline: none;
        }

        &::placeholder {
            color: var(--color-text-40);
        }
    }
</style>