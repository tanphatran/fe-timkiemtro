import { useEffect, useState } from "react";
import {
    MainContainer,
    ConversationHeader,
    MessageList,
    Message,
    MessageInput,
} from "@chatscope/chat-ui-kit-react";
import axiosClient from "@/apis/axiosClient";
import useWebSocket from "@/hooks/useWebSocket";
import useMeStore from "@/zustand/useMeStore";
import useChatStore from "@/zustand/useChatStore";
import { useParams } from "react-router-dom";

export default function ChatRoom() {
    const { id: userId } = useMeStore();
    const { id: partnerId } = useParams();
    const { messages: realtimeMessages, sendMessage: sendWSMessage } = useWebSocket(userId);

    const conversationList = useChatStore((state) => state.conversationList);
    const partner = conversationList.find((c) => String(c.id) === String(partnerId));
    const partnerName = partner?.name || "Người dùng";

    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!partnerId) return;

        const fetchMessages = async () => {
            try {
                const res = await axiosClient.getOne(`/messages/${partnerId}`);
                if (res.status === "success") {
                    const fetchedMessages = res.data
                        .map((msg) => ({
                            text: msg.content,
                            sender: String(msg.senderId) === String(userId) ? "me" : "them",
                            time: msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : "",
                            messageId: msg.messageId,
                        }))
                        .sort((a, b) => a.messageId - b.messageId);
                    setMessages(fetchedMessages);
                }
            } catch (error) {
                console.error("Lỗi khi lấy tin nhắn:", error.message);
            }
        };

        fetchMessages();
    }, [partnerId, userId]);

    useEffect(() => {
        if (!realtimeMessages.length) return;

        realtimeMessages.forEach((msg) => {
            if (String(msg.senderId) === String(partnerId)) {
                const formattedMsg = {
                    text: msg.content,
                    sender: "them",
                    time: msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : "",
                    messageId: msg.messageId || Date.now(),
                };
                setMessages((prev) => [...prev, formattedMsg]);
            }
        });
    }, [realtimeMessages, partnerId]);

    const sendMessage = (text) => {
        if (text.trim()) {
            const msg = {
                senderId: userId,
                recipientId: partnerId,
                content: text,
            };
            sendWSMessage(msg);

            const localMsg = {
                text,
                sender: "me",
                time: new Date().toLocaleTimeString(),
                messageId: Date.now(),
            };
            setMessages((prev) => [...prev, localMsg]);

            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 2000);
        }
    };

    return (
        <div className="flex flex-col flex-grow border-l">
            <ConversationHeader>
                <ConversationHeader.Content userName={partnerName} info="Cuộc hội thoại" />
            </ConversationHeader>

            <div className="flex-grow overflow-y-auto p-4">
                <MessageList>
                    {messages.map((msg, index) => (
                        <Message
                            key={index}
                            model={{
                                message: msg.text,
                                sentTime: msg.time,
                                sender: msg.sender === "me" ? "Bạn" : partnerName,
                                direction: msg.sender === "me" ? "outgoing" : "incoming",
                                position: "normal",
                            }}
                        />
                    ))}
                </MessageList>

                {isTyping && (
                    <div className="mt-2 text-sm text-gray-500 italic">
                        {`${partnerName} đang nhập...`}
                    </div>
                )}
            </div>

            <div className="border-t p-2 bg-white">
                <MessageInput
                    placeholder="Nhập tin nhắn vào đây"
                    onSend={sendMessage}
                    attachButton={false}
                />
            </div>
        </div>
    );
}
