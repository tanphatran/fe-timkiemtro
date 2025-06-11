import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    IconButton,
    Paper,
    Typography,
    TextField,
    CircularProgress,
    Fade,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@mui/material/styles";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import useMeStore from "../zustand/useMeStore";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const baseURL = import.meta.env.VITE_API_URL;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null);
    const [initializing, setInitializing] = useState(false);
    const { id: userId } = useMeStore();

    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

    const dotAnimation = keyframes`
  0%, 20% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  80%, 100% { transform: translateY(0); }
`;

    const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

    const LoadingIndicator = () => (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                p: 1.5,
                bgcolor: "grey.100",
                borderRadius: 2,
                width: "fit-content",
            }}
        >
            {[0, 1, 2].map((dot) => (
                <Box
                    key={dot}
                    sx={{
                        width: 8,
                        height: 8,
                        bgcolor: "primary.main",
                        borderRadius: "50%",
                        animation: `${dotAnimation} 1s ease-in-out infinite`,
                        animationDelay: `${dot * 0.2}s`,
                    }}
                />
            ))}
        </Box>
    );

    const initializeConversation = async () => {
        if (!userId) {
            setMessages([
                {
                    type: "bot",
                    content:
                        '<p style="color: #f44336;">Vui lòng đăng nhập để sử dụng chatbot.</p>',
                },
            ]);
            return;
        }

        setInitializing(true);
        try {
            // Try to get existing conversation
            const historyResponse = await axios.get(
                `${baseURL}/v1/chatbot/conversations/latest?userId=${userId}`
            );

            if (historyResponse.data.conversationId) {
                // Have existing conversation
                setConversationId(historyResponse.data.conversationId);

                // Convert history messages to our Message format
                const historyMessages = historyResponse.data.messages.map(
                    (msg) => ({
                        type: msg.role === "user" ? "user" : "bot",
                        content: msg.content,
                    })
                );

                setMessages(historyMessages);
                return;
            }

            // No history - create new conversation
            const response = await axios.post(
                `${baseURL}/v1/chatbot/conversations?userId=${userId}`
            );

            setConversationId(response.data);

            // Add welcome message
            const welcomeResponse = await axios.post(
                `${baseURL}/v1/chatbot/chat`,
                {
                    conversationId: response.data,
                    content: "Xin chào",
                }
            );

            setMessages([{ type: "bot", content: welcomeResponse.data }]);
        } catch (error) {
            console.error("Error initializing conversation:", error);
            // Check if error is "User has no conversations"
            if (
                error.response?.status === 500 &&
                error.response?.data?.message === "User has no conversations"
            ) {
                // Create new conversation for user
                const response = await axios.post(
                    `${baseURL}/v1/chatbot/conversations?userId=${userId}`
                );

                setConversationId(response.data);

                // Add welcome message
                const welcomeResponse = await axios.post(
                    `${baseURL}/v1/chatbot/chat`,
                    {
                        conversationId: response.data,
                        content: "Xin chào",
                    }
                );

                setMessages([{ type: "bot", content: welcomeResponse.data }]);
            } else {
                setMessages([
                    {
                        type: "bot",
                        content:
                            '<p style="color: #f44336;">Không thể kết nối đến chatbot. Vui lòng thử lại sau.</p>',
                    },
                ]);
            }
        } finally {
            setInitializing(false);
        }
    };

    const handleToggle = () => {
        if (!isOpen && !conversationId) {
            initializeConversation();
        }
        setIsOpen(!isOpen);
    };

    const handleSend = async () => {
        if (!input.trim() || !conversationId) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [
            ...prev,
            { type: "user", content: userMessage },
        ]);
        setLoading(true);

        try {
            const response = await axios.post(
                `${baseURL}/v1/chatbot/chat`,
                {
                    conversationId,
                    content: userMessage,
                }
            );

            setMessages((prev) => [
                ...prev,
                { type: "bot", content: response.data },
            ]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                {
                    type: "bot",
                    content:
                        '<p style="color: #f44336;">Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.</p>',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const InitializingIndicator = () => (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                p: 3,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    animation: `${fadeInUp} 0.5s ease-out`,
                }}
            >
                {[0, 1, 2, 3].map((dot) => (
                    <Box
                        key={dot}
                        sx={{
                            width: 12,
                            height: 12,
                            bgcolor: "primary.main",
                            borderRadius: "50%",
                            animation: `${dotAnimation} 1.5s ease-in-out infinite`,
                            animationDelay: `${dot * 0.2}s`,
                            opacity: 0.7,
                        }}
                    />
                ))}
            </Box>
            <Typography
                color="text.secondary"
                sx={{
                    animation: `${fadeInUp} 0.5s ease-out`,
                    animationDelay: "0.2s",
                    animationFillMode: "backwards",
                }}
            >
                Đang kết nối...
            </Typography>
        </Box>
    );

    return (
        <>
            <IconButton
                onClick={handleToggle}
                title="AI Assistant"
                sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    background: "linear-gradient(135deg, #0287a8 0%, #43c6e6 100%)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    border: "4px solid #fff",
                    boxShadow: "0 8px 32px rgba(2,135,168,0.25)",
                    width: 64,
                    height: 64,
                    zIndex: 1200,
                    transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
                    animation: !isOpen ? `${pulseAnimation} 2s infinite` : "none",
                    "&:hover": {
                        background: "linear-gradient(135deg, #43c6e6 0%, #0287a8 100%)",
                        boxShadow: "0 12px 36px rgba(2,135,168,0.35)",
                        transform: "scale(1.08)",
                    },
                }}
            >
                <SupportAgentIcon sx={{ fontSize: 36, m: 0 }} />
            </IconButton>

            <Fade in={isOpen}>
                <Paper
                    sx={{
                        position: "fixed",
                        bottom: 90,
                        right: 20,
                        width: 400,
                        maxHeight: 600,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 12px 36px rgba(2,135,168,0.18)",
                        borderRadius: 4,
                        overflow: "hidden",
                        zIndex: 1100,
                        animation: `${fadeInUp} 0.3s ease-out`,
                        bgcolor: "#fafdff",
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 1,
                            background: "linear-gradient(135deg, #0287a8 0%, #43c6e6 100%)",
                            color: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "#fff",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: 2,
                                mr: 1,
                            }}>
                                <SupportAgentIcon sx={{ color: "#0287a8", fontSize: 22 }} />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: 18,
                                    textShadow: "0 2px 4px rgba(0,0,0,0.08)",
                                }}
                            >
                                Trọ Tốt Assistant
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={handleToggle}
                            sx={{
                                color: "white",
                                "&:hover": {
                                    transform: "rotate(90deg)",
                                    transition: "transform 0.3s ease",
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Messages */}
                    <Box
                        sx={{
                            p: 2,
                            flexGrow: 1,
                            overflow: "auto",
                            maxHeight: 400,
                            bgcolor: alpha("#fff", 0.98),
                            "&::-webkit-scrollbar": {
                                width: "8px",
                            },
                            "&::-webkit-scrollbar-track": {
                                bgcolor: "transparent",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                bgcolor: alpha("#0287a8", 0.18),
                                borderRadius: "4px",
                                "&:hover": {
                                    bgcolor: alpha("#0287a8", 0.28),
                                },
                            },
                        }}
                    >
                        {initializing ? (
                            <InitializingIndicator />
                        ) : (
                            <>
                                {messages.map((message, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: 2,
                                            display: "flex",
                                            justifyContent:
                                                message.type === "user"
                                                    ? "flex-end"
                                                    : "flex-start",
                                            animation: `${fadeInUp} 0.3s ease-out`,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                maxWidth: "80%",
                                                p: 2,
                                                borderRadius:
                                                    message.type === "user"
                                                        ? "20px 20px 8px 20px"
                                                        : "20px 20px 20px 8px",
                                                bgcolor:
                                                    message.type === "user"
                                                        ? "#0287a8"
                                                        : alpha("#e3f7fb", 0.9),
                                                color:
                                                    message.type === "user"
                                                        ? "white"
                                                        : "#0287a8",
                                                boxShadow: 1,
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    boxShadow: 2,
                                                    transform:
                                                        "translateY(-1px)",
                                                },
                                            }}
                                        >
                                            {message.type === "bot" ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(
                                                            message.content
                                                        ),
                                                    }}
                                                />
                                            ) : (
                                                <Typography>
                                                    {message.content}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                                <div ref={messagesEndRef} />
                                {loading && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            my: 2,
                                        }}
                                    >
                                        <LoadingIndicator />
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>

                    {/* Input */}
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: "background.paper",
                            borderTop: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder={
                                initializing
                                    ? "Đang kết nối..."
                                    : "Nhập tin nhắn..."
                            }
                            value={input}
                            disabled={initializing}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSend()
                            }
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    "&:hover": {
                                        "& > fieldset": {
                                            borderColor: "primary.main",
                                        },
                                    },
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={handleSend}
                                        disabled={!input.trim() || loading}
                                        color="primary"
                                        sx={{
                                            transition: "transform 0.2s ease",
                                            "&:hover": {
                                                transform: "scale(1.1)",
                                            },
                                            "&:active": {
                                                transform: "scale(0.95)",
                                            },
                                        }}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                </Paper>
            </Fade>
        </>
    );
};

export default Chatbot; 