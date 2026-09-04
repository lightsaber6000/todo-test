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
        return isNew.value
            ? "new"
            : id.value ?? null;
    });

    let stopDraftWatch: (() => void) | null = null;

    const saveDraftDebounced = debounce(async () => {
        if (!note.value || !draftKey.value) return;

        await saveDraft(
            {
                noteId: draftKey.value,
                note: structuredClone(toRaw(note.value)),
            },
            draftKey.value,
        );
    }, 700);

    const startDraftAutosave = () => {
        stopDraftWatch = watch(
            note,
            () => {
                saveDraftDebounced();
            },
            {
                deep: true,
            },
        );
    };

    const initDraft = async (
        initialNote: Note,
    ): Promise<void> => {
        const key = draftKey.value!;

        await loadDraft(key);

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
                await removeDraft(key);
            }
        }

        note.value = editorNote;

        startDraftAutosave();
    };

    const discardDraft = async () => {
        stopDraftWatch?.();
        stopDraftWatch = null;

        saveDraftDebounced.cancel();

        const key = draftKey.value;

        if (key) {
            await removeDraft(key);
        }

        clearDraft();
    };

    onUnmounted(() => {
        stopDraftWatch?.();
        stopDraftWatch = null;

        saveDraftDebounced.flush();
    });

    return {
        initDraft,
        discardDraft,
    };
};