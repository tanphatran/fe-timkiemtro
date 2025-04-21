import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useWebSocket(userId) {
    const [messages, setMessages] = useState([]);
    const clientRef = useRef(null);

    useEffect(() => {
        if (!userId) return;

        const socket = new SockJS("http://localhost:8080/ws");
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
    }, [userId]);

    const sendMessage = (messageData) => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({
                destination: "/app/chat",
                body: JSON.stringify(messageData),
            });
        }
    };

    return { messages, sendMessage };
}
