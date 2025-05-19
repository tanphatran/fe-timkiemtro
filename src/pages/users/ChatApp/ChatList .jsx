import { useEffect } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    Sidebar,
    ConversationList,
    Conversation,
    Avatar,
} from "@chatscope/chat-ui-kit-react";
import axiosClient from "@/apis/axiosClient";
import { useNavigate, useLocation } from "react-router-dom";
import useChatStore from "@/zustand/useChatStore";

export default function ChatList() {
    const conversationList = useChatStore((state) => state.conversationList); // ✅ lấy từ zustand
    const setConversationList = useChatStore((state) => state.setConversationList);
    const navigate = useNavigate();
    const location = useLocation();
    const currentChatId = location.pathname.split("/").pop();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await axiosClient.getMany("/groupchat");
                if (data.status === "success") {
                    const conversations = data.data.map((item) => ({
                        id: item.recipientId,
                        name: item.fullName,
                        info: item.messageStatus,
                        avatar: item.profilePicture,
                    }));
                    setConversationList(conversations); // ✅ lưu vào zustand
                }
            } catch (error) {
                console.error("Lỗi khi gọi API groupchat:", error.message);
            }
        };

        fetchConversations();
    }, []);

    return (
        <Sidebar position="left" className="w-1/4 h-full">
            <ConversationList>
                {conversationList.map((conv) => (
                    <Conversation
                        key={conv.id}
                        name={conv.name}
                        info={conv.info}
                        active={String(conv.id) === String(currentChatId)}
                        onClick={() => navigate(`/users/chat/${conv.id}`)}
                    >
                        <Avatar src={conv.avatar} />
                    </Conversation>
                ))}
            </ConversationList>
        </Sidebar>
    );
}
