import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import Sidebar from '../common/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import useMeStore from '@/zustand/useMeStore';

const sidebarWidth = 350;

const MainLayout = () => {
    const navigate = useNavigate();
    const { role } = useMeStore(); // Lấy vai trò người dùng từ store

    useEffect(() => {
        // Kiểm tra nếu không phải là ADMIN hoặc MODERATOR thì điều hướng đi nơi khác
        if (role !== "ADMIN" && role !== "MODERATOR") {
            navigate("/"); // Điều hướng về trang chủ hoặc trang khác nếu không phải là ADMIN hoặc MODERATOR
        }
    }, [role, navigate]); // Thực hiện khi role thay đổi

    return (
        <Box display="flex">
            {/* sidebar */}
            <Sidebar sidebarWidth={sidebarWidth} />
            {/* sidebar */}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    height: "100vh",
                    width: { sm: `calc(100% - ${sidebarWidth}px)` }
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;