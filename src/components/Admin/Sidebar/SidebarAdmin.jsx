import React from "react";
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
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { BsPersonCircle } from "react-icons/bs";
import { MdOutlinePerson } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";

const SidebarAdmin = () => {
    const menuItems = [
        { title: "Quản lý bài viết", icon: <RiDashboardHorizontalLine />, url: "/admin/dashboard" },
        { title: "Quản lý chủ trọ", icon: <MdOutlinePerson />, url: "#" },
        { title: "Quản lý nhân viên", icon: <GrUserManager />, url: "#" },
    ];

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-4 ">
                    <BsPersonCircle size={22} className="text-primary" />
                    <h1 className="text-primary ">Trotot Admin</h1>
                </div>

            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItems.map((item, index) => (
                            <SidebarMenuItem key={index}>
                                <SidebarMenuButton asChild>
                                    <a href={item.url}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <span>© 2024 Your Company</span>
            </SidebarFooter>
        </Sidebar>
    );
};

export default SidebarAdmin;
