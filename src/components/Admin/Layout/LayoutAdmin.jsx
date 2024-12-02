import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarAdmin from "../Sidebar/SidebarAdmin";
import { Outlet } from "react-router-dom"; // Dùng Outlet để render route con

const LayoutAdmin = () => {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen"> {/* Flex để chia cột */}
                {/* Sidebar */}
                <div >
                    <SidebarAdmin />
                </div>
                {/* Nội dung chính */}
                <main className="flex-1 overflow-auto bg-gray-50">
                    <SidebarTrigger />
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
};

export default LayoutAdmin;
