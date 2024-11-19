import React, { useState } from 'react';
import Logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Login from '../login/Login';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className='fixed top-0 right-0 w-full z-50 bg-white backdrop-blur-sm text-black shadow-md'>
            <div className='container flex justify-between items-center py-3 sm:py-0'>
                {/* Logo */}
                <div className="flex items-center gap-4 font-bold text-2xl">
                    <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                        <img src={Logo} alt="Logo" className="h-14" />
                    </Link>
                </div>
                <div className='flex items-center gap-5'>
                    {/* Sử dụng Link để điều hướng đến trang tìm kiếm */}
                    <Link to="/search" className='hover:underline'>
                        Tìm kiếm
                    </Link>
                    {/* Nút Đăng nhập/Đăng ký */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className='hover:underline'>
                                Đăng nhập/ Đăng ký
                            </button>
                        </DialogTrigger>
                        <DialogContent isHideClose={true} className="min-w-[700] p-0">
                            <DialogHeader>
                                <DialogTitle></DialogTitle>
                                <Login />
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    {/* Nút Đăng tin */}
                    <button className="bg-gradient-to-r from-primary to-secondary hover:bg-bg-gradient-to-r hover:from-secondary hover:bg-primary transition-all duration-600 text-white px-3 py-1 rounded-sm">
                        Đăng tin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
