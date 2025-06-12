import { Outlet } from "react-router-dom";
import ChatList from "./ChatList ";
import { MainContainer } from "@chatscope/chat-ui-kit-react";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatLayout() {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/"); // hoặc "/" nếu muốn về trang chủ
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) return null;

    return (
        <div className="h-[93vh] mt-14 flex justify-center items-center">
            <MainContainer className="flex w-[70vw] h-full border rounded-lg shadow-lg">
                <ChatList />
                <Outlet />

            </MainContainer>
        </div>
    );
}
