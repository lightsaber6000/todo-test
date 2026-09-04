export type NotesSyncMessage = {
    type: "note-deleted";
    id: string;
};

let channel: BroadcastChannel | null = null;

const getChannel = () => {
    if (typeof BroadcastChannel === "undefined") {
        return null;
    }

    if (!channel) {
        channel = new BroadcastChannel("notes-sync");
    }

    return channel;
};

export const broadcastNoteDeleted = (id: string) => {
    getChannel()?.postMessage({
        type: "note-deleted",
        id,
    } satisfies NotesSyncMessage);
};

export const subscribeNotesSync = (callback: (message: NotesSyncMessage) => void) => {
    const channel = getChannel();

    if (!channel) {
        return () => { };
    }

    const handler = (event: MessageEvent<NotesSyncMessage>) => {
        callback(event.data);
    };

    channel.addEventListener("message", handler);

    return () => {
        channel.removeEventListener("message", handler);
    };
};