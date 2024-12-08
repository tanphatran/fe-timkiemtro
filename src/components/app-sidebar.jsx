import * as React from "react"
import { RiDashboardLine } from "react-icons/ri";
import { BsPersonCircle } from "react-icons/bs";
import { MdOutlinePerson } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";

import { SearchForm } from "@/components/search-form"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Tổng quan",
      url: "#",
      items: [
        {
          title: "Thống kê ",
          url: "#",
        },
      ],
    },
    {
      title: "Quản lý",
      url: "#",
      items: [
        {
          title: "Quản lý bài viết", icon: <RiDashboardLine size={20} />, url: "/admin/dashboard",
        },
        {
          title: "Quản lý chủ trọ", icon: <MdOutlinePerson size={20} />, url: "/admin/hostmanagenment",
        },
        {
          title: "Quản lý nhân viên", icon: <GrUserManager size={20} />, url: "#",
        },
      ],
    },

  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar {...props}>
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>)
  );
}
