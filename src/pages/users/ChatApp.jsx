import { useEffect, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  Sidebar,
  ConversationList,
  Conversation,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";
import axiosClient from "@/apis/axiosClient";
import useWebSocket from "@/hooks/useWebSocket";
import useMeStore from "@/zustand/useMeStore";
import { useNavigate } from "react-router-dom";

export default function ChatApp() {
  const { id: userId } = useMeStore();
  const { messages: realtimeMessages, sendMessage: sendWSMessage } = useWebSocket(userId);
  const navigate = useNavigate();

  const [conversationList, setConversationList] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  // Lấy danh sách các cuộc trò chuyện
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
          if (conversations.length > 0) {
            setSelectedConversation(conversations[0]);
          }
        }
      } catch (error) {
        console.error("Lỗi khi gọi API groupchat:", error.message);
      }
    };

    fetchConversations();
  }, []);

  // Lấy tin nhắn cho cuộc trò chuyện đang chọn
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation || !userId) return;

      try {
        const res = await axiosClient.getOne(`/messages/${selectedConversation.id}`);
        if (res.status === "success") {
          const fetchedMessages = res.data
            .map((msg) => ({
              text: msg.content,
              sender: String(msg.senderId) === String(userId) ? "me" : "them",
              time: msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString()
                : "",
              messageId: msg.messageId,
            }))
            .sort((a, b) => a.messageId - b.messageId); // sắp xếp theo thứ tự

          setConversationMessages((prev) => ({
            ...prev,
            [selectedConversation.id]: fetchedMessages,
          }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error.message);
      }
    };

    fetchMessages();
  }, [selectedConversation, userId]);

  useEffect(() => {
    console.log("userId từ Zustand:", userId);
  }, [userId]);

  useEffect(() => {
    if (!realtimeMessages.length) return;

    realtimeMessages.forEach((msg) => {
      const partnerId = msg.senderId;

      const formattedMsg = {
        text: msg.content,
        sender: "them",
        time: msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : "",
        messageId: msg.messageId || Date.now(),
      };

      setConversationMessages((prev) => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), formattedMsg],
      }));
    });
  }, [realtimeMessages]);


  const messages = selectedConversation
    ? conversationMessages[selectedConversation.id] || []
    : [];

  // Gửi tin nhắn (chỉ local demo)
  const sendMessage = (text) => {
    if (text.trim() && selectedConversation) {
      const msg = {
        senderId: userId,
        recipientId: selectedConversation.id,
        content: text,
      };
      console.log("📤 Tin nhắn chuẩn bị gửi qua WebSocket:", msg);
      // Gửi qua WebSocket
      sendWSMessage(msg);

      // Update UI local ngay lập tức
      const localMsg = {
        text,
        sender: "me",
        time: new Date().toLocaleTimeString(),
        messageId: Date.now(),
      };

      setConversationMessages((prev) => ({
        ...prev,
        [selectedConversation.id]: [
          ...(prev[selectedConversation.id] || []),
          localMsg,
        ],
      }));

      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };


  return (
    <div className="h-[93vh] mt-14 flex justify-center items-center">
      <MainContainer className="flex w-[70vw] h-full border rounded-lg shadow-lg">
        {/* Sidebar danh sách cuộc trò chuyện */}
        <Sidebar position="left" className="w-1/4">
          <ConversationList>
            {conversationList.map((conv) => (
              <Conversation
                key={conv.id}
                name={conv.name}
                info={conv.info}
                active={selectedConversation?.id === conv.id}
                onClick={() => navigate(`/users/chat/${conv.id}`)}
              >
                <Avatar src={conv.avatar} />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>

        {/* Khung chat chính */}
        <div className="flex flex-col flex-grow border-l">
          {selectedConversation && (
            <>
              <ConversationHeader>
                <ConversationHeader.Content
                  userName={selectedConversation.name}
                  info="Cuộc hội thoại"
                />
              </ConversationHeader>

              <div className="flex-grow overflow-y-auto p-4">
                <MessageList>
                  {messages.map((msg, index) => (
                    <Message
                      key={index}
                      model={{
                        message: msg.text,
                        sentTime: msg.time,
                        sender:
                          msg.sender === "me"
                            ? "Bạn"
                            : selectedConversation.name,
                        direction: msg.sender === "me" ? "outgoing" : "incoming",
                        position: "normal",
                      }}
                    />
                  ))}
                </MessageList>

                {isTyping && (
                  <div className="mt-2 text-sm text-gray-500 italic">
                    {`${selectedConversation.name} đang nhập...`}
                  </div>
                )}
              </div>

              <div className="border-t p-2 bg-white">
                <MessageInput
                  placeholder="Type message here"
                  onSend={sendMessage}
                  attachButton={false}
                />
              </div>
            </>
          )}
        </div>
      </MainContainer>
    </div>
  );
}
