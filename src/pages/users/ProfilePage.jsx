import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiTimeFive } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Link, Outlet } from "react-router-dom";
import pathnames from "@/lib/pathnames";
import axiosClient from "@/apis/axiosClient";

const ProfilePage = () => {
    const [activeButton, setActiveButton] = useState(null);
    const [profileData, setProfileData] = useState({});

    // Fetch profile data from API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosClient.getOne("/user/profile");
                console.log("Response data:", response.data); // Kiểm tra chính xác cấu trúc của dữ liệu

                setProfileData(response.data);  // Cập nhật dữ liệu cá nhân

            } catch (error) {
                console.error("Lỗi khi lấy thông tin cá nhân:", error);
            }
        };

        fetchProfile();
    }, []);




    // Hàm để thay đổi trạng thái active của nút
    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <div className="mt-8 container mx-auto py-8 px-4 sm:px-8 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="p-1">
                        <CardHeader className="flex flex-col items-center">
                            <Avatar className="w-24 h-24">
                                <AvatarImage
                                    src={profileData?.profilePicture || ""}
                                    alt="Avatar"
                                />
                                <AvatarFallback>
                                    {profileData?.fullName
                                        ? profileData.fullName.split(" ").map((word) => word[0]).join("")
                                        : "NA"}
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="mt-4 text-center text-xl font-bold">
                                {profileData?.fullName || "Người dùng"}
                            </CardTitle>
                            <p className="text-gray-500 text-sm text-center">
                                {profileData?.isLandlordActivated === "APPROVED"
                                    ? "Đã xác thực"
                                    : "Chưa xác thực"}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <Link to={pathnames.users.editprofile}>
                                <Button
                                    variant="secondary"
                                    className={`w-full bg-white text-gray border border-secondary/50 ${activeButton === 'editProfile' ? 'bg-gradient-to-l from-secondary to-primary text-white' : 'hover:bg-gradient-to-l hover:from-secondary hover:to-primary hover:text-white'}`}
                                    onClick={() => handleButtonClick('editProfile')}
                                >
                                    Chỉnh sửa trang cá nhân
                                </Button>
                            </Link>
                            <Link to={pathnames.users.postmana}>
                                <Button
                                    variant="secondary"
                                    className={`w-full mt-2 bg-white text-gray border border-secondary/50 ${activeButton === 'postManagement' ? 'bg-gradient-to-l from-secondary to-primary text-white' : 'hover:bg-gradient-to-l hover:from-secondary hover:to-primary hover:text-white'}`}
                                    onClick={() => handleButtonClick('postManagement')}
                                >
                                    Quản lý bài viết
                                </Button>
                            </Link>
                            <Link to={pathnames.users.verification}>
                                <Button
                                    variant="secondary"
                                    className={`w-full mt-2 bg-white text-gray border border-secondary/50 ${activeButton === 'verification' ? 'bg-gradient-to-l from-secondary to-primary text-white' : 'hover:bg-gradient-to-l hover:from-secondary hover:to-primary hover:text-white'}`}
                                    onClick={() => handleButtonClick('verification')}
                                >
                                    Xác thực tài khoản
                                </Button>
                            </Link>
                            <Link to={pathnames.users.favoriteposts}>
                                <Button
                                    variant="secondary"
                                    className={`w-full mt-2 bg-white text-gray border border-secondary/50 ${activeButton === 'favoritePosts' ? 'bg-gradient-to-l from-secondary to-primary text-white' : 'hover:bg-gradient-to-l hover:from-secondary hover:to-primary hover:text-white'}`}
                                    onClick={() => handleButtonClick('favoritePosts')}
                                >
                                    Bài viết yêu thích
                                </Button>
                            </Link>
                            <Link to={pathnames.users.createposts}>
                                <Button
                                    variant="secondary"
                                    className={`w-full mt-2 bg-white text-gray border border-secondary/50 ${activeButton === 'createPosts' ? 'bg-gradient-to-l from-secondary to-primary text-white' : 'hover:bg-gradient-to-l hover:from-secondary hover:to-primary hover:text-white'}`}
                                    onClick={() => handleButtonClick('createPosts')}
                                >
                                    Tạo bài viết
                                </Button>
                            </Link>
                        </CardContent>
                        <CardContent>
                            <p className="flex items-center text-sm text-gray-600">
                                <BiTimeFive className="mr-2 text-base align-middle" />
                                Đã tham gia:
                                <span className="ml-1 font-bold">
                                    {profileData?.createdAt
                                        ? new Date(profileData.createdAt).toLocaleDateString("vi-VN", {
                                            day: "2-digit", // Lấy ngày theo định dạng 2 chữ số
                                            month: "2-digit", // Lấy tháng theo định dạng 2 chữ số
                                            year: "numeric", // Lấy năm đầy đủ
                                        })
                                        : "N/A"}
                                </span>
                            </p>

                            <p className="flex items-center text-sm text-gray-600">
                                <AiOutlineCheckCircle className={`mr-2 text-base align-middle ${profileData?.isLandlordActivated === "APPROVED" ? "text-green-500" : "text-gray-600"}`}
                                />
                                Đã xác thực:
                                <span className="ml-1">
                                    {profileData?.isLandlordActivated === "APPROVED" ? "CCCD" : "Chưa xác thực"}
                                </span>
                            </p>
                            <p className="flex items-center text-sm text-gray-600">
                                <HiOutlineLocationMarker className="mr-2 text-base align-middle" />
                                Địa chỉ: {profileData?.address || "Chưa cung cấp"}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content (Sẽ được thay bằng các Component khác thông qua <Outlet>) */}
                <div className="lg:col-span-3">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
