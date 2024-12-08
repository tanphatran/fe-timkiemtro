import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddUserDialog = ({ isOpen, onClose, onAddUser }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
        address: "",
        registrationDate: new Date().toISOString().split("T")[0], // Lấy ngày hiện tại
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu và Xác nhận mật khẩu không khớp!");
            return;
        }

        // Gửi dữ liệu người dùng mới
        onAddUser(formData);
        onClose(); // Đóng dialog
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Thêm người dùng</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                        <Input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Xác nhận mật khẩu"
                            required
                        />
                    </div>

                    {/* Ngày sinh */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                        <Input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Địa chỉ thường trú */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Địa chỉ thường trú</label>
                        <Input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ thường trú"
                            required
                        />
                    </div>

                    {/* Ngày đăng ký */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày đăng ký</label>
                        <Input
                            type="date"
                            name="registrationDate"
                            value={formData.registrationDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <DialogFooter className="mt-4">
                    <Button variant="ghost" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button variant="default" className="bg-gradient-to-r from-primary to-secondary text-white" onClick={handleSubmit}>
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserDialog;
