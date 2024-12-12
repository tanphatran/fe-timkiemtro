import React from "react";
import FooterLogo from "../../assets/logo.png";
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaLocationArrow,
    FaMobileAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const FooterLinks = [
    {
        title: "Trang chủ Trotot",
        link: "/",
    },
    {
        title: "Tìm kiếm phòng trọ",
        link: "/search",
    },
    {
        title: "Phòng trọ Hồ Chí Minh",
        link: "/",
    },
    {
        title: "Phòng trọ Hà Nội",
        link: "/",
    },
];

const Footer = () => {
    return (
        <>
            <div className="bg-primary/10 dark:bg-gray-950 py-10 relative overflow-hidden">
                <div className="container">
                    <div className="grid md:grid-cols-3 py-5 bg-white/80 backdrop-blur-sm rounded-t-xl">
                        <div className="py-8 px-4">
                            <h1 className="flex items-center gap-3 text-xl sm:text-3xl font-bold text-justify sm:text-left">
                                <img src={FooterLogo} alt="" className="max-h-[60px]" />
                                {/* TravelloGo */}
                            </h1>
                            <p className="text-sm">
                                Trotot là website giúp người dùng tìm kiếm phòng trọ nhanh chóng nhất.
                            </p>
                            <br />
                            <div className="flex items-center gap-3 ">
                                <FaLocationArrow />
                                <p>Thủ Đức, TP. Hồ Chí Minh</p>
                            </div>
                            <div className="flex items-center gap-3 mt-3">
                                <FaMobileAlt />
                                <p>+84 24356789</p>
                            </div>
                            {/* social handles */}
                            <div>
                                <div className="flex items-center gap-3 mt-6">
                                    <a href="#">
                                        <FaInstagram className="text-3xl" />
                                    </a>
                                    <a href="#">
                                        <FaFacebook className="text-3xl" />
                                    </a>
                                    <a href="#">
                                        <FaLinkedin className="text-3xl" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
                            <div>
                                <div className="py-8 px-4">
                                    <h1 className="text-xl font-bold text-justify sm:text-left mb-3">
                                        Tìm kiếm nhanh chóng
                                    </h1>
                                    <ul className="flex flex-col gap-3">
                                        {FooterLinks.map((link) => (
                                            <li
                                                key={link.title}
                                                className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200"
                                            >
                                                <Link
                                                    to={link.link}
                                                    onClick={() => window.scrollTo(0, 0)}
                                                >
                                                    <span>&#11162;</span>
                                                    <span>{link.title}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <div className="py-8 px-4">
                                    <h1 className="text-xl font-bold text-justify sm:text-left mb-3">
                                        Đăng tin dễ dàng
                                    </h1>
                                    <ul className="flex flex-col gap-3">
                                        {FooterLinks.map((link) => (
                                            <li
                                                key={link.title}
                                                className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200"
                                            >
                                                <Link
                                                    to={link.link}
                                                    onClick={() => window.scrollTo(0, 0)}
                                                >
                                                    <span>&#11162;</span>
                                                    <span>{link.title}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <div className="py-8 px-4">
                                    <h1 className="text-xl font-bold text-justify sm:text-left mb-3">
                                        Website Nhatot
                                    </h1>
                                    <ul className="flex flex-col gap-3">
                                        {FooterLinks.map((link) => (
                                            <li
                                                key={link.title}
                                                className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200"
                                            >
                                                <Link
                                                    to={link.link}
                                                    onClick={() => window.scrollTo(0, 0)}
                                                >
                                                    <span>&#11162;</span>
                                                    <span>{link.title}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-center py-5 border-t-2 border-gray-300/50 bg-primary text-white">
                            @copyright 2024 All rights reserved
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;
