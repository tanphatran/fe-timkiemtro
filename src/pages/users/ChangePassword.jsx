import React, { useState } from "react";
import axiosClient from "@/apis/axiosClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

const ChangePassword = () => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setAlert({ message: "Mật khẩu mới và xác nhận mật khẩu không khớp!", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.post("/auth/update-password", passwordData);
            if (response.status === "success") {
                setAlert({ message: "Đổi mật khẩu thành công!", type: "success" });
                setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
            } else {
                setAlert({ message: "Đổi mật khẩu thất bại!", type: "error" });
            }
        } catch (error) {
            setAlert({ message: "Lỗi khi đổi mật khẩu", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto pb-8 px-4 sm:px-8 lg:px-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold">Đổi mật khẩu</CardTitle>
                </CardHeader>
                <CardContent>
                    {alert.message && (
                        <Alert className="mb-4" variant={alert.type}>
                            {alert.message}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                Mật khẩu hiện tại
                            </label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                Mật khẩu mới
                            </label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                                Xác nhận mật khẩu mới
                            </label>
                            <Input
                                id="confirmNewPassword"
                                type="password"
                                value={passwordData.confirmNewPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                                className="mt-1"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading} className="bg-primary text-white">
                                {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChangePassword;
