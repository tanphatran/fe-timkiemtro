import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useWebSocket(userId) {
    const [messages, setMessages] = useState([]);
    const clientRef = useRef(null);

    // Lấy URL WebSocket từ biến môi trường
    const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";

    useEffect(() => {
        if (!userId) return;

        const socket = new SockJS(WS_URL);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("✅ Connected to WebSocket");
                client.subscribe(`/user/${userId}/queue/messages`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMessage]);
                });
            },
            onStompError: (frame) => {
                console.error("Broker error: ", frame.headers["message"]);
            },
            debug: (str) => console.log(str),
        });

        client.activate();
        clientRef.current = client;

        return () => {
            if (client.connected) client.deactivate();
        };
    }, [userId, WS_URL]);

    const sendMessage = (messageData) => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({
                destination: "/app/chat",
                body: JSON.stringify(messageData),
            });
            console.log("📤 Tin nhắn đã gửi:", messageData);  // Log tin nhắn gửi đi
        } else {
            console.error("WebSocket chưa kết nối hoặc không khả dụng.");
        }
    };


    return { messages, sendMessage };
}
