import type { ButtonVariant } from "~/components/Button.vue";

export type DialogResult = string | number | boolean | null;

export type DialogButton = {
    title: string;
    variant: ButtonVariant;
    value: DialogResult;
};

export type DialogOptions = {
    title: string;
    text?: string;
    buttons?: DialogButton[];
};

export type ShowDialogFn = (options: DialogOptions) => Promise<DialogResult>;

let showDialogFn: ShowDialogFn | null = null;

export const setDialogFn = (fn: ShowDialogFn) => showDialogFn = fn;

export const dialog: ShowDialogFn = async (options) => {
    if (!showDialogFn) {
        throw new Error("Dialog not initialized");
    }

    return showDialogFn(options);
};