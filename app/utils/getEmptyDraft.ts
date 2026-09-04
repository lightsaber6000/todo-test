import { type Draft } from "~/types/note";
import getEmptyNote from "~/utils/getEmptyNote";

const getEmptyDraft = (): Draft => ({
    noteId: crypto.randomUUID(),
    note: getEmptyNote(),
    baseRevision: 0,
});

export default getEmptyDraft;