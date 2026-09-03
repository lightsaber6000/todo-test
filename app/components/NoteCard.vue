<template>
    <div class="note-card">
        <div class="note-card__actions">
            <Button iconOnly ariaLabel="Редактировать" :to="`/notes/${note.id}`">
                <Pencil />
            </Button>
            <Button iconOnly ariaLabel="Удалить" @click="$emit('remove', $event)">
                <Trash />
            </Button>
        </div>
        <p class="note-card__title">{{ note.title }}</p>
        <ul class="note-card__todos" v-if="note.todos && note.todos.length">
            <li :class="['note-card__todos-item', todoEL.complete && 'note-card__todos-item--completed']"
                v-for="todoEL in note.todos" :key="todoEL.id">
                - {{ todoEL.text }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { type Note } from "~/types/note";
    import Button from "~/components/Button.vue";
    import { Pencil, Trash } from '@lucide/vue';

    const props = defineProps<{
        note: Note;
    }>();

    defineEmits(["remove"]);
</script>

<style scoped lang="scss">
    .note-card {
        position: relative;
        padding: 1.25rem 6.5625rem 1.25rem 1.25rem;
        border: 1px solid var(--color-line);
        &__actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.625rem;
            position: absolute;
            right: 0.625rem;
            top: 0.625rem;
        }
        &__title {
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 2.5rem;
        }
        &__todos {
            display: grid;
            gap: 0.625rem;
        }
        &__todos-item {
            &--completed {
                text-decoration: line-through;
            }
        }
    }
</style>