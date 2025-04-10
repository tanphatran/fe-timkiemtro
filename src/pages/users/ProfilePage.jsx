import React, { useState, useEffect } from "react";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
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
import pathnames from "@/lib/pathnames";
import axiosClient from "@/apis/axiosClient";
import useMeStore from "@/zustand/useMeStore";
import useActiveButtonStore from "@/zustand/useActiveButtonStore";

const ProfilePage = () => {
    const location = useLocation();
    const { activeButton, setActiveButton } = useActiveButtonStore();
    const [profileData, setProfileData] = useState({});
    const { role } = useMeStore();
    const navigate = useNavigate();

    // Tự động cập nhật trạng thái active theo pathname
    useEffect(() => {
        const { pathname } = location;
        if (pathname.includes("editprofile")) {
            setActiveButton("editProfile");
        } else if (pathname.includes("changepassword")) {
            setActiveButton("changepassword");
        } else if (pathname.includes("postmana")) {
            setActiveButton("postManagement");
        } else if (pathname.includes("verification")) {
            setActiveButton("verification");
        } else if (pathname.includes("favorite-posts")) {
            setActiveButton("favoriteposts");
        } else if (pathname.includes("create-posts")) {
            setActiveButton("createPosts");
        } else {
            setActiveButton(null);
        }
    }, [location.pathname, setActiveButton]);
    useEffect(() => {
        console.log("Current pathname:", location.pathname);
    }, [location.pathname]);

    // Fetch profile data from API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosClient.getOne("/user/profile");
                console.log("Response data:", response.data);
                setProfileData(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin cá nhân:", error);
            }
        };

        fetchProfile();
    }, []);

    // Handler riêng cho nút tạo bài viết
    const handleButtonClickcreatePosts = () => {
        if (role === "TENANT") {
            navigate("/users/verification");
        } else {
            navigate("/users/create-posts");
        }
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
                                        ? profileData.fullName
                                            .split(" ")
                                            .map((word) => word[0])
                                            .join("")
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
                                    className={`w-full bg-white text-gray border border-secondary/50 ${activeButton === "editProfile"
                                        ? "bg-gradient-to-l from-secondary to-primary text-white"
                                        : "hover:bg-gradient-to-l hover:from-secondary hover:to-primary hover:text-white"
                                        }`}
                                >
                                    Chỉnh sửa trang cá nhân
                                </Button>
                            </Link>
                            <Link to={pathnames.users.changepassword}>
                                <Button
                                    variant="secondary"
                                    className={`w-full mt-2 bg-white text-gray border border-secondary/50 ${activeButton === "changepassword"
                                        ? "bg-gradient-to-l from-secondary to-primary text-white"
                                        : "hover:bg-gradient-to-l hover:from-secondary hover:to-primary hover:text-white"
                                        }`}
                                >
                                    Đổi mật khẩu
                                </Button>
                            </Link>
                            <Link to={pathnames.users.postmana}>
                                <Button
                                    variant="secondary"
                                    className={`w-full mt-2 bg-white text-gray border border-secondary/50 ${activeButton === "postManagement"
                                        ? "bg-gradient-to-l from-secondary to-primary text-white"
                                        : "hover:bg-gradient-to-l hover:from-secondary hover:to-primary hover:text-white"
                                        }`}
                                >
                                    Quản lý bài viết
                                </Button>
                            </Link>
                            <Link to={pathnames.users.verification}>
                                <Button
                                    variant="secondary"
                                    className={`w-full mt-2 bg-white text-gray border border-secondary/50 ${activeButton === "verification"
                                        ? "bg-gradient-to-l from-secondary to-primary text-white"
                                        : "hover:bg-gradient-to-l hover:from-secondary hover:to-primary hover:text-white"
                                        }`}
                                >
                                    Xác thực tài khoản
                                </Button>
                            </Link>
                            <Link to={pathnames.users.favoriteposts}>
                                <Button
                                    variant="secondary"
                                    className={`w-full mt-2 bg-white text-gray border border-secondary/50 ${activeButton === "favoriteposts"
                                        ? "bg-gradient-to-l from-secondary to-primary text-white"
                                        : "hover:bg-gradient-to-l hover:from-secondary hover:to-primary hover:text-white"
                                        }`}
                                >
                                    Bài viết yêu thích
                                </Button>
                            </Link>
                            <Button
                                variant="secondary"
                                className={`w-full mt-2 bg-white text-gray border border-secondary/50 ${activeButton === "createPosts"
                                    ? "bg-gradient-to-l from-secondary to-primary text-white"
                                    : "hover:bg-gradient-to-l hover:from-secondary hover:to-primary hover:text-white"
                                    }`}
                                onClick={handleButtonClickcreatePosts}
                            >
                                Tạo bài viết
                            </Button>
                        </CardContent>
                        <CardContent>
                            <p className="flex items-center text-sm text-gray-600">
                                <BiTimeFive className="mr-2 text-base align-middle" />
                                Đã tham gia:
                                <span className="ml-1 font-bold">
                                    {profileData?.createdAt
                                        ? new Date(profileData.createdAt).toLocaleDateString("vi-VN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })
                                        : "N/A"}
                                </span>
                            </p>

                            <p className="flex items-center text-sm text-gray-600">
                                <AiOutlineCheckCircle
                                    className={`mr-2 text-base align-middle ${profileData?.isLandlordActivated === "APPROVED"
                                        ? "text-green-500"
                                        : "text-gray-600"
                                        }`}
                                />
                                Đã xác thực:
                                <span className="ml-1">
                                    {profileData?.isLandlordActivated === "APPROVED"
                                        ? "CCCD"
                                        : "Chưa xác thực"}
                                </span>
                            </p>
                            <p className="flex items-center text-sm text-gray-600">
                                <HiOutlineLocationMarker className="mr-2 text-base align-middle" />
                                Địa chỉ: {profileData?.address || "Chưa cung cấp"}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content (các Component con sẽ được render qua <Outlet>) */}
                <div className="lg:col-span-3">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
