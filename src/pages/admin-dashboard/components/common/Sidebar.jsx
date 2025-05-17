import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography, colors } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

import Logo from "@/assets/logo.png";
import Animate from "./Animate";
import useAuth from "@/hooks/useAuth";
import LogoutIcon from '@mui/icons-material/Logout';

// Định nghĩa ánh xạ menuPathMap
const menuPathMap = {
    inbox: "/chatapp",
    overview: "/admin/dashboard",
    notification: "/notifications",

    post: "/admin/post",
    carloan: "/car-loans",
    insurance: "/insurance",

    user: "/admin/usermana",
    landlord: "/admin/hostmanagenment",
    staff: "/admin/employeemana"
};

// Định nghĩa các menu
const menus = [
    { title: "Inbox", icon: <MailOutlinedIcon />, state: "inbox" },
    { title: "Tổng quan", icon: <DashboardCustomizeOutlinedIcon />, state: "overview" },
    { title: "Thông báo", icon: <NotificationsOutlinedIcon />, state: "notification" }
];

const serviceMenus = [
    { title: "Quản lý bài đăng", icon: <ArticleOutlinedIcon />, state: "post" },
];

const investmentMenus = [
    { title: "Người dùng", icon: <PersonOutlineOutlinedIcon />, state: "user" },
    { title: "Chủ trọ", icon: <HomeWorkOutlinedIcon />, state: "landlord" },
    { title: "Nhân viên", icon: <BadgeOutlinedIcon />, state: "staff" }
];


const Sidebar = ({ sidebarWidth }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearAuth } = useAuth();

    // Xác định menu đang active
    const activeState = Object.keys(menuPathMap).find(
        (key) => menuPathMap[key] === location.pathname
    );
    const handleLogout = () => {
        clearAuth();
        navigate("/");
    };
    const MenuItem = (props) => {
        const path = menuPathMap[props.item.state] || "/"; // Fallback nếu không có route tương ứng
        return (
            <ListItem key={props.index} disableGutters disablePadding sx={{ py: 0.5 }}>
                <ListItemButton
                    onClick={() => navigate(path)} // Điều hướng tới path
                    sx={{
                        borderRadius: "10px",
                        bgcolor: props.isActive ? "#0287a8" : "",
                        color: props.isActive ? colors.common.white : "",
                        "&:hover": {
                            bgcolor: props.isActive ? "#0287a8" : "",
                            color: props.isActive ? colors.common.white : "",
                        }
                    }}
                >
                    <ListItemIcon sx={{
                        minWidth: "40px",
                        color: props.isActive ? colors.common.white : ""
                    }}>
                        {props.item.icon}
                    </ListItemIcon>
                    <ListItemText primary={
                        <Typography fontWeight={600}>
                            {props.item.title}
                        </Typography>
                    } />
                </ListItemButton>
            </ListItem>
        );
    };

    const drawer = (
        <Box
            padding={3}
            paddingBottom={0}
            display="flex"
            flexDirection="column"
            height="100vh"
            sx={{
                "::-webkit-scrollbar": {
                    display: "none"
                }
            }}
        >
            {/* logo */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
                <Animate type="fade" delay={1}>
                    <img src={Logo} alt="logo" height={60} />
                </Animate>
            </Box>

            <Animate sx={{ flexGrow: 1 }}>
                <Paper
                    elevation={0}
                    square
                    sx={{
                        borderTopRightRadius: "10px",
                        borderTopLeftRadius: "10px",
                        p: 2,
                        height: "100%",
                        boxShadow: "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px"
                    }}
                >
                    {/* menu group 1 */}
                    <List>
                        {menus.map((item, index) => (
                            <MenuItem
                                key={index}
                                item={item}
                                isActive={item.state === activeState}
                            />
                        ))}
                    </List>

                    {/* menu group 2 */}
                    <List>
                        <ListItem>
                            <Typography fontWeight={600} mt={1} color={colors.grey[600]}>
                                Bài đăng
                            </Typography>
                        </ListItem>
                        {serviceMenus.map((item, index) => (
                            <MenuItem
                                key={index}
                                item={item}
                                isActive={item.state === activeState}
                            />
                        ))}
                    </List>

                    {/* menu group 3 */}
                    <List>
                        <ListItem>
                            <Typography fontWeight={600} mt={1} color={colors.grey[600]}>
                                Quản Lý Tài Khoản
                            </Typography>
                        </ListItem>
                        {investmentMenus.map((item, index) => (
                            <MenuItem
                                key={index}
                                item={item}
                                isActive={item.state === activeState}
                            />
                        ))}
                    </List>
                    <List sx={{ mt: 2 }}>
                        <ListItem disableGutters disablePadding>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{
                                    borderRadius: "10px",
                                    color: colors.grey[800],
                                    "&:hover": {
                                        bgcolor: "#f44336", // đỏ nhạt
                                        color: colors.common.white
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: "40px", color: "inherit" }}>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary={
                                    <Typography fontWeight={600}>
                                        Đăng xuất
                                    </Typography>
                                } />
                            </ListItemButton>
                        </ListItem>
                    </List>

                </Paper>
            </Animate>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{
                width: { md: sidebarWidth },
                flexShrink: { md: 0 }
            }}
        >
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", sm: "none", md: "block" },
                    "& .MuiDrawer-paper": {
                        zIndex: 1,
                        boxSizing: "border-box",
                        width: sidebarWidth,
                        borderWidth: 0,
                        bgcolor: "transparent",
                        "::-webkit-scrollbar": {
                            display: "none"
                        }
                    }
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
