import React, { useState } from 'react';
import Logo from "../../assets/logo.png";
import { Link, NavLink } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi'; // Import biểu tượng từ react-icons

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className='fixed top-0 right-0 w-full z-50 bg-white backdrop-blur-sm text-black shadow-md'>
            <div className='container flex justify-between items-center py-3 sm:py-0'>
                {/* Logo */}
                <div className="flex items-center gap-4 font-bold text-2xl">
                    <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                        <img src={Logo} alt="" className="h-14" />
                    </Link>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex">
                    <ul className="flex items-center gap-6">
                        <li className="py-4">
                            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                                Trang chủ
                            </NavLink>
                        </li>
                        <li className="py-4">
                            <NavLink to="/search" className={({ isActive }) => isActive ? "active" : ""}>
                                Tìm kiếm
                            </NavLink>
                        </li>
                        <li className="py-4">
                            <NavLink to="/account" className={({ isActive }) => isActive ? "active" : ""}>
                                Đăng nhập
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* Button and Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <button className="bg-gradient-to-r from-primary to-secondary hover:bg-bg-gradient-to-r hover:from-secondary hover:bg-primary transition-all duration-600 text-white px-3 py-1 rounded-full">
                        Đăng tin mới
                    </button>

                    {/* Hamburger Icon */}
                    <button
                        className="md:hidden text-3xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <HiMenu /> {/* Biểu tượng hamburger từ react-icons */}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <ul className="flex flex-col items-center gap-4 py-4">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) => isActive ? "active" : ""}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Trang chủ
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/search"
                                className={({ isActive }) => isActive ? "active" : ""}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Tìm kiếm
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/account"
                                className={({ isActive }) => isActive ? "active" : ""}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Tài khoản
                            </NavLink>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;
