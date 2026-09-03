<template>
    <div class="note-card">
        <div class="note-card__actions">
            <Button iconOnly ariaLabel="Редактировать" to="/">
                <Pencil />
            </Button>
            <Button iconOnly ariaLabel="Удалить">
                <Trash />
            </Button>
        </div>
        <p class="note-card__title">{{ note.title }}</p>
        <ul class="note-card__todos" v-if="note.todos && note.todos.length">
            <li :class="['note-card__todos-item', todoEL.complete && 'note-card__todos-item--completed']"
                v-for="todoEL in note.todos" :key="todoEL.id">
                {{ todoEL.text }}
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
</script>

<style scoped lang="scss">
    .note-card {
        position: relative;
        &__actions {
            position: absolute;
            right: 0;
            top: 0;
        }
        &__todos {
            display: grid;
            gap: 20px;
        }
        &__todos-item {
            &--completed {
                text-decoration: line-through;
            }
        }
    }
</style>