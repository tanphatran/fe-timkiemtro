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
    const partner = useChatStore((state) => state.partner);

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
                        isOnline: item.messageStatus === "ONLINE",
                    }));
                    setConversationList(conversations);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API groupchat:", error.message);
            }
        };

        fetchConversations();
    }, []);

    const isPartnerInList =
        partner && !conversationList.some((conv) => String(conv.id) === String(partner.id));

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
                        <Avatar>
                            <div className="relative w-full h-full">
                                <img
                                    src={conv.avatar}
                                    alt="avatar"
                                    className="rounded-full w-full h-full object-cover"
                                />
                                <span
                                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${conv.isOnline ? "bg-green-500" : "bg-gray-400"
                                        }`}
                                ></span>
                            </div>
                        </Avatar>
                    </Conversation>
                ))}

                {isPartnerInList && (
                    <Conversation
                        key={partner.id}
                        name={partner.name}
                        info={partner.info}
                        active={String(partner.id) === String(currentChatId)}
                        onClick={() => navigate(`/users/chat/${partner.id}`)}
                    >
                        <Avatar>
                            <div className="relative w-full h-full">
                                <img
                                    src={partner.avatar}
                                    alt="avatar"
                                    className="rounded-full w-full h-full object-cover"
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-gray-400"></span>
                            </div>
                        </Avatar>
                    </Conversation>
                )}
            </ConversationList>
        </Sidebar>
    );
}
