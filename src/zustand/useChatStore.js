import { create } from 'zustand';

const useChatStore = create((set) => ({
    conversationList: [],
    setConversationList: (list) => set({ conversationList: list }),
}));

export default useChatStore;
