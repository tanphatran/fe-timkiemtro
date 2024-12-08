import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AddressModal from "@/components/Address/AddressModal";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import axiosClient from "@/apis/axiosClient"; // Đường dẫn tới apiClient.js

const EditPostDialog = ({ postId, userUuid, onSaveSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [address, setAddress] = useState({
        province: "",
        district: "",
        commune: "",
        street: "",
        houseNumber: "",
    });
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        depositAmount: "",
        price: "",
        area: "",
        furnitureStatus: "",
        numberOfRooms: "",
        electricityPrice: "",
        waterPrice: "",
        images: [],
        licensePcccUrl: "",
        licenseBusinessUrl: "",
    });

    // Tự động tải bài viết khi postId thay đổi
    useEffect(() => {
        if (postId) {
            const fetchPost = async () => {
                try {
                    const data = await axiosClient.getOne(`/post/${postId}`);
                    setFormData({
                        title: data.title,
                        description: data.description,
                        depositAmount: data.depositAmount,
                        price: data.price,
                        area: data.area,
                        furnitureStatus: data.furnitureStatus,
                        numberOfRooms: data.numberOfRooms,
                        electricityPrice: data.electricityPrice,
                        waterPrice: data.waterPrice,
                        images: data.postImages,
                        licensePcccUrl: data.licensePcccUrl || "",
                        licenseBusinessUrl: data.licenseBusinessUrl || "",
                    });
                    setAddress({
                        province: data.city,
                        district: data.district,
                        commune: data.ward,
                        street: data.street,
                        houseNumber: data.houseNumber,
                    });
                } catch (error) {
                    console.error("Không thể tải bài viết:", error);
                    alert("Không thể tải bài viết.");
                }
            };

            fetchPost();
        }
    }, [postId]);

    const handleSubmit = async () => {
        const payload = {
            postImages: formData.images,
            title: formData.title || "Untitled",
            description: formData.description || "No description",
            depositAmount: parseFloat(formData.depositAmount) || 0,
            price: parseFloat(formData.price) || 0,
            area: parseFloat(formData.area) || 0,
            furnitureStatus: formData.furnitureStatus || "UNKNOWN",
            numberOfRooms: parseInt(formData.numberOfRooms, 10) || 0,
            electricityPrice: parseFloat(formData.electricityPrice) || 0,
            waterPrice: parseFloat(formData.waterPrice) || 0,
            city: address.province || "UNKNOWN",
            district: address.district || "UNKNOWN",
            ward: address.commune || "UNKNOWN",
            street: address.street || "",
            houseNumber: address.houseNumber || "",
            licensePcccUrl: formData.licensePcccUrl || "",
            licenseBusinessUrl: formData.licenseBusinessUrl || "",
        };

        try {
            const response = await axiosClient.put(
                `/api/post/update/${postId}?userUuid=${userUuid}`,
                payload
            );
            alert(response.message || "Cập nhật bài đăng thành công!");
            if (onSaveSuccess) onSaveSuccess();
        } catch (error) {
            console.error("Update failed:", error);
            alert("Cập nhật bài đăng thất bại.");
        }
    };

    return (
        <Dialog open={!!postId} onOpenChange={(open) => !open && onSaveSuccess()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
                        <ImageUploader
                            variant="outline"
                            className="mt-2"
                            label="Ảnh nhà trọ"
                            minFiles={5}
                            maxFiles={9}
                            onUploadSuccess={(uploadedImages) => setFormData({ ...formData, images: uploadedImages })}
                            initialFiles={formData.images}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                        <Input
                            value={`${address.houseNumber || ""}, ${address.street || ""}, ${address.commune || ""}, ${address.district || ""}, ${address.province || ""}`
                                .replace(/, $/, "")}

                            onClick={() => setIsModalOpen(true)}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={5}
                        />
                    </div>
                </div>                <DialogFooter>
                    <Button variant="outline" onClick={() => onSaveSuccess()}>Hủy</Button>
                    <Button onClick={handleSubmit}>Cập nhật</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditPostDialog;
