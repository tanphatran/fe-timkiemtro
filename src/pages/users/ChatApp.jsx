import { useState } from "react";
import { useLocation } from "react-router-dom";
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
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

export default function ChatApp() {
  const location = useLocation();
  const { userId, userName, userAvatar } = location.state || {};
  // Nếu không có thông tin từ state, sử dụng giá trị mặc định
  const conversationName = userName || "Người cho thuê";
  const conversationAvatar = userAvatar || "https://via.placeholder.com/40";

  // Danh sách các cuộc trò chuyện
  const conversationList = [
    {
      id: 1,
      name: conversationName,
      info: "Cuộc hội thoại mới",
      avatar: conversationAvatar,
    },
    {
      id: 2,
      name: "Lilly",
      info: "Always on holidays",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Joe",
      info: "Sleeping",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 4,
      name: "Emily",
      info: "Are you there?",
      avatar: "https://via.placeholder.com/40",
    },
  ];

  // State lưu cuộc trò chuyện hiện tại được chọn
  const [selectedConversation, setSelectedConversation] = useState(conversationList[0]);

  // State lưu tin nhắn của từng cuộc trò chuyện (key là id của conversation)
  const [conversationMessages, setConversationMessages] = useState({
    1: [
      {
        text: `Chào ${conversationList[0].name}, tôi muốn trao đổi về phòng trọ.`,
        sender: "me",
        time: "10:00 AM",
      },
      {
        text: `Xin chào! Cảm ơn bạn đã liên hệ. Tôi sẵn sàng trao đổi.`,
        sender: "other",
        time: "10:01 AM",
      },
    ],
    2: [
      {
        text: "Chào Lilly, tôi có thắc mắc về phòng trọ.",
        sender: "me",
        time: "10:05 AM",
      },
      {
        text: "Hi, bạn cần biết gì thêm?",
        sender: "other",
        time: "10:06 AM",
      },
    ],
    3: [
      {
        text: "Chào Joe, tôi muốn hỏi về thông tin phòng.",
        sender: "me",
        time: "10:07 AM",
      },
      {
        text: "Được, bạn hỏi đi.",
        sender: "other",
        time: "10:08 AM",
      },
    ],
    4: [
      {
        text: "Chào Emily, tôi cần trao đổi về phòng.",
        sender: "me",
        time: "10:09 AM",
      },
      {
        text: "Xin chào, tôi có thể giúp gì?",
        sender: "other",
        time: "10:10 AM",
      },
    ],
  });

  // Lấy tin nhắn của cuộc trò chuyện hiện tại
  const messages = conversationMessages[selectedConversation.id] || [];

  const sendMessage = (text) => {
    if (text.trim()) {
      const newMessage = {
        text,
        sender: "me",
        time: new Date().toLocaleTimeString(),
      };
      setConversationMessages((prev) => ({
        ...prev,
        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage],
      }));
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
                active={selectedConversation.id === conv.id}
                onClick={() => setSelectedConversation(conv)}
              >
                <Avatar src={conv.avatar} />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>

        {/* Khung chat chính */}
        <div className="flex flex-col flex-grow border-l">
          {/* Header hiển thị thông tin cuộc trò chuyện */}
          <ConversationHeader>
            <ConversationHeader.Content
              userName={selectedConversation.name}
              info="Cuộc hội thoại"
            />
          </ConversationHeader>

          {/* Danh sách tin nhắn - Có thể cuộn */}
          <div className="flex-grow overflow-y-auto p-4">
            <MessageList>
              {messages.map((msg, index) => (
                <Message
                  key={index}
                  model={{
                    message: msg.text,
                    sentTime: msg.time,
                    sender: msg.sender === "me" ? "You" : selectedConversation.name,
                    direction: msg.sender === "me" ? "outgoing" : "incoming",
                    position: "normal",
                  }}
                />
              ))}
              <TypingIndicator content={`${selectedConversation.name} is typing...`} />
            </MessageList>
          </div>

          {/* Khung nhập tin nhắn */}
          <div className="border-t p-2 bg-white">
            <MessageInput placeholder="Type message here" onSend={sendMessage} attachButton={false} />
          </div>
        </div>
      </MainContainer>
    </div>
  );
}
