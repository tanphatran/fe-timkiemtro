import React, { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarAdmin from "../Sidebar/SidebarAdmin";
import { Outlet, useNavigate } from "react-router-dom";
import useMeStore from "@/zustand/useMeStore";

const LayoutAdmin = () => {
    const navigate = useNavigate();
    const { role } = useMeStore(); // Lấy vai trò người dùng từ store

    useEffect(() => {
        // Kiểm tra nếu không phải là ADMIN hoặc MODERATOR thì điều hướng đi nơi khác
        if (role !== "ADMIN" && role !== "MODERATOR") {
            navigate("/"); // Điều hướng về trang chủ hoặc trang khác nếu không phải là ADMIN hoặc MODERATOR
        }
    }, [role, navigate]); // Thực hiện khi role thay đổi

    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen">
                {/* Sidebar */}
                <div>
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
