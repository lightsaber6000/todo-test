import { computed, onUnmounted, toRaw, watch } from "vue";
import { useDraftsStore } from "~/stores/drafts";
import { debounce } from "lodash-es";
import type { Note } from "~/types/note";
import { dialog } from "~/services/dialogService";

export const useDraftLayer = (isNew: Ref<boolean>, id: Ref<string | undefined>, note: Ref<Note | null>) => {
    const draftsStore = useDraftsStore();

    const { draft } = storeToRefs(draftsStore);

    const {
        load: loadDraft,
        save: saveDraft,
        remove: removeDraft,
        clear: clearDraft,
    } = draftsStore;

    const draftKey = computed(() => {
        return isNew.value ? "new" : id.value ?? null;
    });

    let stopDraftWatch: (() => void) | null = null;
    let hasUnsavedChanges = false;

    const saveDraftNow = () => {
        const currentNote = note.value;
        const key = draftKey.value;

        if (!hasUnsavedChanges || !currentNote || !key) return;

        saveDraft(
            {
                noteId: key,
                note: structuredClone(toRaw(currentNote)),
            },
            key,
        );

        hasUnsavedChanges = false;
    };

    const saveDraftDebounced = debounce(saveDraftNow, 700);

    const flushDraft = () => {
        saveDraftDebounced.cancel();
        saveDraftNow();
    };

    const stopDraftAutosave = () => {
        stopDraftWatch?.();
        stopDraftWatch = null;

        window.removeEventListener("pagehide", flushDraft);
    };

    const startDraftAutosave = () => {
        stopDraftWatch = watch(
            note,
            () => {
                hasUnsavedChanges = true;
                saveDraftDebounced();
            },
            {
                deep: true,
            },
        );

        window.addEventListener("pagehide", flushDraft);
    };

    const initDraft = async (
        initialNote: Note,
    ): Promise<void> => {
        const key = draftKey.value!;

        loadDraft(key);

        let editorNote = initialNote;

        const currentDraft = draft.value;

        if (currentDraft) {
            const restore = await dialog({
                title: "Восстановить черновик?",
                text: "Найдены несохраненные изменения",
                buttons: [
                    {
                        title: "Не восстанавливать",
                        value: false,
                    },
                    {
                        title: "Восстановить",
                        value: true,
                    },
                ],
            });

            if (restore) {
                editorNote = structuredClone(toRaw(currentDraft.note));
            } else {
                removeDraft(key);
            }
        }

        note.value = editorNote;

        startDraftAutosave();
    };

    const discardDraft = () => {
        stopDraftAutosave();
        saveDraftDebounced.cancel();
        hasUnsavedChanges = false;

        const key = draftKey.value;

        if (key) {
            removeDraft(key);
        }

        clearDraft();
    };

    onUnmounted(() => {
        stopDraftAutosave();
        flushDraft();
    });

    return {
        initDraft,
        discardDraft,
    };
};
