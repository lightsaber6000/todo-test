import { onMounted, onUnmounted } from "vue";
import { dialog } from "~/services/dialogService";
import { subscribeNotesSync } from "~/services/notesSync";

export const useSyncLayer = (
    isNew: Ref<boolean>,
    id: Ref<string | undefined>,
    onExternalDeleteCallback: () => void | Promise<void> = () => { },
) => {
    let unsubscribeNotesSync: (() => void) | null = null;
    let externalDeleteHandled = false;

    const onExternalDelete = async () => {
        if (externalDeleteHandled) return;

        externalDeleteHandled = true;

        await onExternalDeleteCallback();

        await dialog({
            title: "Заметка удалена",
            text: "Эта заметка была удалена в другой вкладке",
            buttons: [
                {
                    title: "Ок",
                    value: null,
                },
            ],
        });

        await navigateTo("/");
    };

    const startNotesSync = () => {
        unsubscribeNotesSync = subscribeNotesSync(
            message => {
                if (
                    message.type !== "note-deleted" ||
                    isNew.value ||
                    message.id !== id.value
                ) {
                    return;
                }

                void onExternalDelete();
            },
        );
    };

    onMounted(() => {
        startNotesSync();
    });

    onUnmounted(() => {
        unsubscribeNotesSync?.();
        unsubscribeNotesSync = null;
    });
};
