import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import Login from "../login/Login";
import { FiMenu, FiX } from "react-icons/fi"; // Icons menu và đóng

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handlePostNavigation = () => {
        navigate("/users/create-posts"); // Điều hướng đến trang "/post"
    };

    return (
        <div className="fixed top-0 right-0 w-full z-50 bg-white/80 backdrop-blur-sm text-black shadow-md">
            <div className="container flex justify-between items-center p-0">
                {/* Logo */}
                <div className="flex items-center gap-4 font-bold text-2xl">
                    <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                        <img src={Logo} alt="Logo" className="h-14" />
                    </Link>
                </div>

                {/* Menu lớn - Chỉ hiển thị trên màn hình >= md */}
                <div className="hidden md:flex items-center gap-5">
                    <Link to="/search" className="hover:underline">
                        Tìm kiếm
                    </Link>
                    {/* Đăng nhập/Đăng ký */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="hoder: underline">Đăng nhập/ Đăng ký</button>
                        </DialogTrigger>
                        <DialogContent isHideClose={true} className="min-w-[700px] p-0">
                            <DialogHeader>
                                <DialogTitle></DialogTitle>
                                <Login />
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
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
                        to="/search"
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
        </div>
    );
};

export default Navbar;
