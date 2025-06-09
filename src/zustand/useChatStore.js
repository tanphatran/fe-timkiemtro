import { create } from 'zustand';

const useChatStore = create((set) => ({
    conversationList: [],
    setConversationList: (list) => set({ conversationList: list }),

    partner: null,
    setPartner: (id, name, avatar = "", info = "", isOnline) =>
        set({
            partner: {
                id,
                name,
                avatar,
                info,
                isOnline
            }
        }),
}));

export default useChatStore;
