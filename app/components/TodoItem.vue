<template>
    <div class="todo-item">
        <Field 
            v-model="modelValue"
            label="Пункт todo"
            :name="`todo-${id}`"
            :disabled="disabled"
            @focus="onFocus"
            @blur="onBlur"
        >
            <template #prepend>
                <Checkbox
                    :name="`checkbox-${id}`" 
                    :ariaLabel="`Отметить ${modelValue} ${complete ? 'невыполненным' : 'выполненным'}`"
                    :disabled="disabled"
                    v-model="complete">
                </Checkbox>
            </template>
            <template #append>
                <Button 
                    iconOnly 
                    :ariaLabel="`Удалить ${modelValue}`"
                    :disabled="disabled"
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

    const emit = defineEmits([  
        "change",
        "remove",
    ]);

    let oldText = "";

    const onFocus = () => {
        oldText = modelValue.value;
    };

    const onBlur = () => {
        if (oldText !== modelValue.value) {
            emit("change", oldText, modelValue.value);
        }
    };
</script>
