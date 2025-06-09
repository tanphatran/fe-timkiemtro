import React, { useState, useEffect } from "react";
import axiosClient from "@/apis/axiosClient"; // Import axiosClient
import { Input } from "@/components/ui/input"; // Assuming you have an Input component from ShadCN UI
import { Button } from "@/components/ui/button"; // Assuming you have a Button component from ShadCN UI
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // For avatar image
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // For cards
import { FaCamera } from "react-icons/fa";
import { Alert } from "@/components/ui/alert"; // Assuming you have an Alert component from ShadCN UI

const EditProfile = () => {
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        dateOfBirth: "",
        profilePicture: "",
        phoneNumber: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "" });

    // Fetch profile data from API using axiosClient
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axiosClient.getOne("user/info-update");
                if (response.status === "success") {
                    setProfileData(response.data);
                } else {
                    setAlert({ message: "Không thể tải dữ liệu người dùng", type: "error" });
                }
            } catch (error) {
                setAlert({ message: "Lỗi khi tải thông tin cá nhân", type: "error" });
            }
        };

        fetchProfileData();
    }, []);

    // Handle image upload
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        try {
            const response = await axiosClient.postMultipart(`/user/profile-picture`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.status === "success") {
                const uploadedImageUrl = response.data;
                setProfileData((prevData) => ({
                    ...prevData,
                    profilePicture: uploadedImageUrl,
                }));
                setAlert({ message: response.message, type: "success" });
            } else {
                setAlert({ message: "Không thể tải ảnh lên. Vui lòng thử lại.", type: "error" });
            }
        } catch (error) {
            setAlert({ message: "Đã xảy ra lỗi khi tải ảnh lên.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Handle form submit to update user info
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosClient.put("user/update", profileData);
            if (response.status === "success") {
                setAlert({ message: "Cập nhật thông tin thành công!", type: "success" });
            } else {
                setAlert({ message: "Cập nhật thông tin thất bại!", type: "error" });
            }
        } catch (error) {
            setAlert({ message: "Lỗi khi cập nhật thông tin", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto pb-8 px-4 sm:px-8 lg:px-16">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold">Chỉnh sửa thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent>
                    {alert.message && (
                        <Alert className={`mb-4`} variant={alert.type}>
                            {alert.message}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative w-32 h-32 mx-auto">
                            {/* Avatar */}
                            <Avatar className="w-full h-full">
                                <AvatarImage src={profileData.profilePicture || ""} alt="Profile Picture" />
                                <AvatarFallback>{profileData.fullName ? profileData.fullName[0] : "NA"}</AvatarFallback>
                            </Avatar>

                            {/* Icon máy ảnh */}
                            <label
                                htmlFor="image-upload"
                                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer flex items-center justify-center"
                                style={{ width: "40px", height: "40px" }}
                            >
                                {loading ? (
                                    <div className="animate-spin border-2 border-gray-300 border-t-primary rounded-full w-6 h-6"></div>
                                ) : (
                                    <FaCamera className="text-gray-600 w-5 h-5" />
                                )}
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Họ và tên
                            </label>
                            <Input
                                id="fullName"
                                value={profileData.fullName}
                                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                id="email"
                                disabled
                                value={profileData.email || ""}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                                Ngày sinh
                            </label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                value={profileData.dateOfBirth || ""}
                                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                                className="mt-1"
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Số điện thoại
                            </label>
                            <Input
                                id="phoneNumber"
                                value={profileData.phoneNumber || ""}
                                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                disabled
                                className="mt-1 border border-gray-300 text-stone-950"
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Địa chỉ
                            </label>
                            <Input
                                id="address"
                                value={profileData.address || ""}
                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                className="mt-1"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-l hover:from-secondary transition-all duration-600 text-white">
                                {loading ? "Đang cập nhật..." : "Cập nhật"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditProfile;
