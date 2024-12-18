import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AddressModal from "@/components/Address/AddressModal";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import axiosClient from "@/apis/axiosClient";

const EditPostDialog = ({ postId, onSaveSuccess }) => {
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
        videoUrl: "",
        licensePcccUrl: "",
        licenseBusinessUrl: "",
    });

    // Tự động tải bài viết khi postId thay đổi
    useEffect(() => {
        console.log("Received postId:", postId);
        if (postId) {
            const fetchPost = async () => {
                try {
                    const { data } = await axiosClient.getOne(`/post/edit/${postId}`);
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
                        videoUrl: data.videoUrl || "",
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
            videoUrl: formData.videoUrl || "",
            licensePcccUrl: formData.licensePcccUrl || "",
            licenseBusinessUrl: formData.licenseBusinessUrl || "",
        };

        try {
            const { data } = await axiosClient.put(`/post/update/${postId}`, payload);
            alert(data.message || "Cập nhật bài đăng thành công!");
            if (onSaveSuccess) onSaveSuccess();
        } catch (error) {
            console.error("Update failed:", error);
            alert("Cập nhật bài đăng thất bại.");
        }
    };

    return (
        <Dialog open={!!postId} onOpenChange={(open) => !open && onSaveSuccess()}>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Hình ảnh */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>

                        {/* Hiển thị hình ảnh đã tải lên */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {formData.images?.length > 0 ? (
                                formData.images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image.url || image} // Đảm bảo đúng định dạng URL
                                            alt={`Uploaded ${index + 1}`}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                        <button
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    images: formData.images.filter((_, i) => i !== index),
                                                })
                                            }
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Chưa có hình ảnh nào.</p>
                            )}
                        </div>

                        {/* Tải lên hình ảnh mới */}
                        <ImageUploader
                            variant="outline"
                            className="mt-2"
                            label="Tải lên hình ảnh"
                            minFiles={1}
                            maxFiles={9}
                            onUploadSuccess={(uploadedImages) =>
                                setFormData({
                                    ...formData,
                                    images: [...formData.images, ...uploadedImages],
                                })
                            }
                        />
                    </div>


                    {/* Video */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video</label>
                        <Input
                            value={formData.videoUrl}
                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                            placeholder="URL video"
                        />
                    </div>

                    {/* Địa chỉ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                        <Input
                            value={`${address.houseNumber || ""}, ${address.street || ""}, ${address.commune || ""}, ${address.district || ""}, ${address.province || ""}`.replace(", ,", ",").replace(/, $/, "")}
                            onClick={() => setIsModalOpen(true)}
                            readOnly
                        />
                    </div>

                    {/* Tiêu đề */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={5}
                        />
                    </div>

                    {/* Giá tiền và đặt cọc */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giá thuê</label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Đặt cọc</label>
                            <Input
                                type="number"
                                value={formData.depositAmount}
                                onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Diện tích và số phòng */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Diện tích (m²)</label>
                            <Input
                                type="number"
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số phòng</label>
                            <Input
                                type="number"
                                value={formData.numberOfRooms}
                                onChange={(e) => setFormData({ ...formData, numberOfRooms: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Giá điện và nước */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giá điện</label>
                            <Input
                                type="number"
                                value={formData.electricityPrice}
                                onChange={(e) => setFormData({ ...formData, electricityPrice: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giá nước</label>
                            <Input
                                type="number"
                                value={formData.waterPrice}
                                onChange={(e) => setFormData({ ...formData, waterPrice: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Tình trạng nội thất */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng nội thất</label>
                        <Input
                            value={formData.furnitureStatus}
                            onChange={(e) => setFormData({ ...formData, furnitureStatus: e.target.value })}
                        />
                    </div>

                    {/* Giấy phép PCCC và kinh doanh */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Giấy phép PCCC</label>
                        <Input
                            value={formData.licensePcccUrl}
                            onChange={(e) => setFormData({ ...formData, licensePcccUrl: e.target.value })}
                            placeholder="URL giấy phép PCCC"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Giấy phép kinh doanh</label>
                        <Input
                            value={formData.licenseBusinessUrl}
                            onChange={(e) => setFormData({ ...formData, licenseBusinessUrl: e.target.value })}
                            placeholder="URL giấy phép kinh doanh"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onSaveSuccess()}>Hủy</Button>
                    <Button onClick={handleSubmit}>Cập nhật</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditPostDialog;
