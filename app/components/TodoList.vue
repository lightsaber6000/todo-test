<template>
    <div class="todo-list">
        <div class="todo-list__inner" v-if="modelValue.length">
            <TodoItem
                v-for="todo in modelValue"
                :key="todo.id"
                v-model="todo.text"
                v-model:complete="todo.complete"
                @remove="() => onRemove(todo.id)"
            />
        </div>
        <Button @click="onAdd">Добавить пункт</Button>
    </div>
</template>

<script setup lang="ts">
    import TodoItem from '~/components/TodoItem.vue';
    import Button from '~/components/Button.vue';
    import { type Todo } from "~/types/note";

    import getEmptyTodo from "~/utils/getEmptyTodo";

    const modelValue = defineModel<Todo[]>({
        required: true,
    });

    const onAdd = () => {
        modelValue.value.push(getEmptyTodo());
    };

    const onRemove = (id: string) => {
        modelValue.value = modelValue.value.filter(el => el.id !== id);
    };
</script>

<style lang="scss">
    .todo-list {
        
        &__inner {
            display: flex;            
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
        }
    }
</style>