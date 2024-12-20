import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RiDashboardLine } from "react-icons/ri";
import { BsPersonCircle } from "react-icons/bs";
import { MdOutlinePerson } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { FaUserCheck } from "react-icons/fa";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";

const SidebarAdmin = () => {
    const location = useLocation(); // Get current location
    const { me, clearAuth } = useAuth();

    const menuItems = [
        { title: "Quản lý bài viết", icon: <RiDashboardLine size={20} />, url: "/admin/dashboard" },
        { title: "Quản lý người dùng", icon: <MdOutlinePerson size={20} />, url: "/admin/usermana" },
        { title: "Quản lý chủ trọ", icon: <FaUserCheck size={20} />, url: "/admin/hostmanagenment" },
        { title: "Quản lý nhân viên", icon: <GrUserManager size={20} />, url: "/admin/employeemana" },
    ];

    // Determine which menu item is active based on the current path
    const getActiveIndex = () => {
        return menuItems.findIndex(item => location.pathname === item.url);
    };

    const [activeIndex, setActiveIndex] = useState(getActiveIndex());

    // Update activeIndex when location changes (e.g., on page navigation)
    useEffect(() => {
        setActiveIndex(getActiveIndex());
    }, [location]);

    const handleLogout = () => {
        clearAuth();
        navigate("/");
    };
    return (
        <Sidebar className="sidebar bg-gray-100 h-full">
            {/* Header */}
            <SidebarHeader className="sidebar-header p-4 border-b">
                <div className="flex items-center gap-4">
                    <BsPersonCircle size={30} className="text-primary" />
                    <h1 className="text-xl font-bold text-primary">Trotot Admin</h1>
                </div>
            </SidebarHeader>

            {/* Content */}
            <SidebarContent className="sidebar-content p-4">
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItems.map((item, index) => (
                            <SidebarMenuItem key={index}>
                                <SidebarMenuButton
                                    asChild
                                    className={`flex items-center gap-2 p-2 rounded ${activeIndex === index
                                        ? "bg-primary/10 text-black"
                                        : "hover:bg-gray-200"
                                        }`}
                                    onClick={() => setActiveIndex(index)} // Cập nhật mục đang được chọn
                                >
                                    <a href={item.url} className="flex items-center gap-2">
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="sidebar-footer p-4 border-t text-center text-sm text-gray-500">
                <span>{me}</span>
                < div className="flex items-center gap-2 justify-center">

                    <button className="hover:underline " onClick={handleLogout}>
                        Đăng xuất
                    </button>

                </div>
                <span>© 2024 Your Company</span>
            </SidebarFooter>
        </Sidebar>
    );
};

export default SidebarAdmin;
