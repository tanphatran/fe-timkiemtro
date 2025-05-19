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
    const conversationList = useChatStore((state) => state.conversationList);
    const setConversationList = useChatStore((state) => state.setConversationList);
    const partner = useChatStore((state) => state.partner); // 👈 lấy partner tạm thời

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
                    setConversationList(conversations);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API groupchat:", error.message);
            }
        };

        fetchConversations();
    }, []);

    // 👇 Kiểm tra nếu partner không nằm trong conversationList
    const isPartnerInList = partner &&
        !conversationList.some((conv) => String(conv.id) === String(partner.id));

    return (
        <Sidebar position="left" className="w-1/4 h-full">
            <ConversationList>
                {/* Hiển thị danh sách từ API */}
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

                {/* 👇 Nếu người nhận chưa có trong list thì thêm ô tạm */}
                {isPartnerInList && (
                    <Conversation
                        key={partner.id}
                        name={partner.name}
                        info={partner.info}
                        active={String(partner.id) === String(currentChatId)}
                        onClick={() => navigate(`/users/chat/${partner.id}`)}
                    >
                        <Avatar src={partner.avatar} />
                    </Conversation>
                )}
            </ConversationList>
        </Sidebar>
    );
}
