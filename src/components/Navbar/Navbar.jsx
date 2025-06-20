import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import Login from "../login/Login";
import { FiMenu, FiMessageSquare, FiX } from "react-icons/fi";
import { SiHomeadvisor } from "react-icons/si";
import useAuth from "@/hooks/useAuth";
import useMeStore from "@/zustand/useMeStore";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FaUser, FaSignOutAlt } from "react-icons/fa"; // Import icons
import axiosClient from "@/apis/axiosClient";
import SearchInfoDialog from "../Notification/SearchInfoDialog ";
import NotificationDialog from "../Notification/NotificationDialog";
import NotificationBell from "./NotificationBell";
import { BsChatDots } from "react-icons/bs";
import pathnames from "@/lib/pathnames";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { token, isLoggedIn, me, clearAuth } = useAuth();
    const { role } = useMeStore();
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false); // Thêm trạng thái cho dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            // await axiosClient.post("/auth/logout");
            clearAuth();
            navigate("/");
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        console.log("User info updated:", me);
    }, [me]);

    const handlePostNavigation = () => {
        if (!isLoggedIn) {
            setIsLoginDialogOpen(true);
            return;
        }
        if (role === "LANDLORD") {
            navigate(pathnames.users.createposts); // Điều hướng phù hợp với LANDLORD
        } else if (role === "TENANT") {
            navigate(pathnames.users.verification); // Điều hướng phù hợp với TENANT
        } else {
            // Mặc định
        }
    };

    const handleSearchInfoClick = async () => {
        try {
            const response = await axiosClient.get("/search-information/has-search-information");
            if (response.data === false) {
                // Nếu chưa có thông tin tìm kiếm, mở dialog tạo mới
                setIsDialogOpen(true);
            } else {
                // Nếu đã có thông tin tìm kiếm, mở dialog cập nhật
                setIsUpdateDialogOpen(true);
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra thông tin tìm kiếm:", error);
        }
    };

    return (
        <div className="fixed top-0 right-0 w-full z-50 bg-white/80 backdrop-blur-sm text-black shadow-md">
            <div className="container flex justify-between items-center p-0">
                {/* Logo */}
                <div className="flex items-center gap-4 font-bold text-2xl">
                    <Link to={pathnames.publics.home} onClick={() => window.scrollTo(0, 0)}>
                        <img src={Logo} alt="Logo" className="h-14" />
                    </Link>
                </div>

                {/* Menu lớn - Chỉ hiển thị trên màn hình >= md */}
                <div className="hidden md:flex items-center gap-5">
                    <Link to={pathnames.publics.search} className="hover:underline">
                        Tìm phòng
                    </Link>

                    <Link to={pathnames.publics.landlord} className="hover:underline">
                        Chủ trọ
                    </Link>

                    {/* Đăng nhập/Đăng ký */}
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <NotificationBell />
                            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                                <DropdownMenuTrigger asChild>
                                    <button className="hover:underline">
                                        Chào, {me || "Người dùng"}!
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48">
                                    <DropdownMenuItem onClick={() => window.location.href = pathnames.users.editprofile}>
                                        <FaUser className="mr-2 text-gray-500" /> {/* Icon Thông tin cá nhân */}
                                        Thông tin cá nhân
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => window.location.href = pathnames.users.chatlayout}>
                                        <BsChatDots className="mr-2 text-gray-500" /> {/* Icon Thông tin cá nhân */}
                                        Tin Nhắn
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setDropdownOpen(false);
                                            setTimeout(() => {
                                                handleSearchInfoClick();
                                            }, 50);
                                        }}
                                    >
                                        <SiHomeadvisor className="mr-2 text-gray-500" />
                                        Yêu cầu tìm phòng
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <FaSignOutAlt className="mr-2 text-gray-500" /> {/* Icon Đăng xuất */}
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
                            <DialogTrigger asChild>
                                <button className="hover:underline">Đăng nhập/Đăng ký</button>
                            </DialogTrigger>
                            <DialogContent isHideClose={true} className="min-w-[700px] p-0">
                                <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                    <Login />
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    )}

                    {/* Đăng tin */}
                    <button
                        onClick={handlePostNavigation} // Gọi hàm điều hướng
                        className="bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-l hover:from-secondary transition-all duration-600 text-white px-3 py-1 rounded-sm"
                    >
                        Đăng tin
                    </button>
                </div>

                {/* Nút menu 3 gạch - Chỉ hiển thị trên màn hình < md */}
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Menu nhỏ - Hiển thị khi bấm vào menu 3 gạch */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg absolute top-full right-0 left-0 p-4 flex flex-col gap-3">
                    <Link
                        to={pathnames.publics.search}
                        className="hover:underline"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Tìm kiếm
                    </Link>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button
                                className="hover:underline text-left"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Đăng nhập/ Đăng ký
                            </button>
                        </DialogTrigger>
                        <DialogContent isHideClose={true} className="min-w-[700px] p-0">
                            <DialogHeader>
                                <DialogTitle></DialogTitle>
                                <Login />
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <button
                        onClick={() => {
                            handlePostNavigation(); // Điều hướng đến /post
                            setIsMenuOpen(false); // Đóng menu sau khi bấm
                        }}
                        className="bg-gradient-to-r from-primary to-secondary hover:bg-bg-gradient-to-r hover:from-secondary hover:bg-primary transition-all duration-600 text-white px-3 py-1 rounded-sm"
                    >
                        Đăng tin
                    </button>
                </div>
            )}
            <SearchInfoDialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen} />
            <NotificationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

        </div>
    );
};

export default Navbar;
