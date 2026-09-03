<template>
    <div class="todo-item">
        <Field v-model="modelValue" label="Пункт todo" :name="`todo-${id}`">
            <template #prepend>
                <Checkbox
                    :name="`checkbox-${id}`" 
                    :ariaLabel="`Отметить ${modelValue} ${complete ? 'невыполненным' : 'выполненным'}`"
                    v-model="complete">
                </Checkbox>
            </template>
            <template #append>
                <Button 
                    iconOnly 
                    :ariaLabel="`Удалить ${modelValue}`"
                    @click="$emit('remove')">
                    <Trash />
                </Button>
            </template>
        </Field>
    </div>
</template>

<script setup lang="ts">
    import { useId } from "vue";

    import Field from "~/components/Field.vue";
    import Button from "~/components/Button.vue";
    import Checkbox from "~/components/Checkbox.vue";
    import { Trash } from '@lucide/vue';

    const props = defineProps<{
        formDirty?: boolean;
        required?: boolean;
        disabled?: boolean;
    }>();

    const modelValue = defineModel<string>("modelValue", {
        required: true,
    })

    const complete = defineModel<boolean>("complete", {
        required: true,
    })

    const id = useId();

    defineEmits(["remove"]);
</script>