import { type Draft } from "~/types/note";
import getEmptyNote from "~/utils/getEmptyNote";

const getEmptyDraft = (): Draft => ({
    noteId: crypto.randomUUID(),
    note: getEmptyNote(),
});

export default getEmptyDraft;