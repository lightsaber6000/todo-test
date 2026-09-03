<template>
    <component
        :is="to ? 'NuxtLink' : 'button'"
        :type="props.type"
        :class="className"
        :disabled="props.disabled"
        :ariaLabel="props.ariaLabel"
        @click="$emit('click', $event)">
        <slot></slot>
    </component>
</template>

<script setup lang="ts">
    import { computed } from "vue";

    type ButtonVariant =
        | "secondary"
        | "danger"
        | "outline";

    const props = defineProps<{
        to?: string,
        variant?: ButtonVariant;
        iconOnly?: boolean;
        disabled?: boolean;
        ariaLabel?: string;
        type?: "button" | "submit";
    }>();

    const className = computed<string>(() => [
            "button",
            props.variant && `btn--${props.variant}`,
            props.iconOnly && "btn--icon-only",
        ].filter(Boolean).join(" "));
</script>

<style scoped lang="scss">
    .button {
        display: inline-flex;
        align-items: center;
        gap: .6em;
        padding: .95em 1.5em;
        background: var(--color-text);
        border: 1px solid var(--color-text);
        color: var(--color-bg);
        letter-spacing: .02em;
        text-decoration: none;
        cursor: pointer;
        transition:
            background-color var(--dur-1) var(--ease),
            border-color var(--dur-1) var(--ease),
            color var(--dur-1) var(--ease),
            transform var(--dur-1) var(--ease);

        &:hover:not(:disabled) {
            background: var(--color-accent);
            border-color: var(--color-accent);
            color: var(--color-accent-text);

            svg {
                transform: translateX(3px);
            }
        }

        &:active:not(:disabled) {
            transform: translateY(1px);
        }

        &:disabled {
            background: var(--color-line);
            border-color: var(--color-line);
            color: var(--color-text-60);
            cursor: not-allowed;

            svg {
                transform: none;
            }
        }

        &--outline {
            padding: .6em 1.1em;
            background: transparent;
            color: var(--color-text);
            font-size: .8rem;

            &:hover:not(:disabled) {
                background: var(--color-text);
                border-color: var(--color-text);
                color: var(--color-bg);
            }
        }

        &--icon-only {
            padding: 0.625rem;
            width: 2.375rem;
            height: 2.375rem;
        }
    }
</style>