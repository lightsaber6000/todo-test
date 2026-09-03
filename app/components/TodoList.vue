<template>
    <div class="todo-list">
        <div class="todo-list__inner" v-if="modelValue.length">
            <TodoItem
                v-for="todo in modelValue"
                :key="todo.id"
                v-model="todo.text"
                v-model:complete="todo.complete"
                @change="(oldValue, newValue) => onChangeText(todo.id, oldValue, newValue)"
                @update:complete="newValue => onToggleComplete(todo.id, newValue)"
                @remove="() => onRemove(todo.id)"
            />
        </div>
        <Button @click="onAdd">Добавить пункт</Button>
    </div>
</template>

<script setup lang="ts">
    import { toRaw } from "vue";
    import TodoItem from '~/components/TodoItem.vue';
    import Button from '~/components/Button.vue';
    import { type Todo } from "~/types/note";

    import getEmptyTodo from "~/utils/getEmptyTodo";

    const modelValue = defineModel<Todo[]>({
        required: true,
    });

    const emit = defineEmits<{
        add: [index: number, todo: Todo];
        remove: [index: number, todo: Todo];
        toggle: [id: string, oldValue: boolean, newValue: boolean];
        changeText: [id: string, oldValue: string, newValue: string];
    }>();

    const onAdd = () => {
        const todo = getEmptyTodo();
        modelValue.value.push(todo);
        const index = modelValue.value.length - 1;
        emit('add', index, todo)
    };

    const onRemove = (id: string) => {
        const index = modelValue.value.findIndex(el => el.id === id);
        if (index === -1) return;

        const todo = structuredClone(toRaw(modelValue.value[index]!));

        modelValue.value.splice(index, 1);

        emit("remove", index, todo);
    };

    const onToggleComplete = (id: string, newValue: boolean) => {
        emit('toggle', id, !newValue, newValue);
    };

    const onChangeText = (
        id: string,
        oldValue: string,
        newValue: string,
    ) => {
        emit("changeText", id, oldValue, newValue);
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