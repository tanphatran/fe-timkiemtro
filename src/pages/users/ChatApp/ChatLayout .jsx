import { Outlet } from "react-router-dom";
import ChatList from "./ChatList ";
import { MainContainer } from "@chatscope/chat-ui-kit-react";

export default function ChatLayout() {
    return (
        <div className="h-[93vh] mt-14 flex justify-center items-center">
            <MainContainer className="flex w-[70vw] h-full border rounded-lg shadow-lg">
                <ChatList />
                <Outlet />

            </MainContainer>
        </div>
    );
}
