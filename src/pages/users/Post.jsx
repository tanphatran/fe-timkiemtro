import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import AddressModal from "@/components/Address/AddressModal";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import axiosClient from "@/apis/axiosClient";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

const Post = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();
    const [postCount, setPostCount] = useState(null);
    const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);

    const [address, setAddress] = useState({
        province: '',
        district: '',
        commune: '',
        street: '',
        houseNumber: ''
    });
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        depositAmount: '',
        price: '',
        area: '',
        furnitureStatus: '',
        numberOfRooms: '',
        electricityPrice: '',
        waterPrice: '',
        images: [],
        licensePcccUrl: '',
        licenseBusinessUrl: ''
    });


    const handleAddressChange = (newAddress) => {
        setAddress(newAddress);
    };

    const handleSaveAddress = (newAddress) => {
        setAddress(newAddress);
    };
    useEffect(() => {
        const fetchPostCount = async () => {
            try {
                const response = await axiosClient.getOne("/user/post-count");
                if (response.data?.postCount !== undefined) {
                    setPostCount(response.data.postCount);
                }
            } catch (err) {
                console.error("Lỗi khi lấy số lượng bài đăng:", err);
            }
        };

        fetchPostCount();
    }, []);
    const handleSubmit = async () => {
        if (isSubmitting) return; // Ngăn bấm nhiều lần

        if (postCount <= 0) {
            setIsLimitDialogOpen(true);
            return;
        }

        if (!formData.title || !formData.description || !formData.furnitureStatus || !formData.price || !formData.area || !formData.depositAmount || !formData.numberOfRooms || !formData.electricityPrice || !formData.waterPrice || formData.images.length === 0) {
            toast({
                title: "Thông báo",
                description: "Vui lòng điền đầy đủ thông tin!",
            });
            return;
        }

        setIsSubmitting(true); // Khóa nút

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
            licenseBusinessUrl: formData.licenseBusinessUrl || ""
        };

        try {
            const response = await axiosClient.post(`/post/create`, payload);
            if (response) {
                toast({
                    description: "Tin đã được gửi để được phê duyệt!",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (err) {
            console.error("Network Error:", err);
            toast({
                description: "Có lỗi xảy ra khi kết nối đến server. Vui lòng thử lại.",
            });
        } finally {
            // Đợi 2 giây rồi mở khóa lại
            setTimeout(() => setIsSubmitting(false), 2000);
        }
    };



    return (

        <div className="border-2 border-dashed border-primary/10 mb-4  mx-auto p-6 bg-white shadow-md rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">Đăng tin phòng trọ</h1>
                <div className="text-sm text-gray-600 text-right">
                    <div>
                        Lượt đăng còn lại: <span className="font-semibold text-primary">{postCount !== null ? postCount : "..."}</span>
                    </div>
                    <a href="/users/postpackage" className="font-semibold text-primary hover:underline">
                        + Thêm lượt đăng
                    </a>
                </div>
            </div>
            <div className="grid my-8 lg:grid-cols-10 gap-4">
                {/* Cột chính */}
                <div className="col-span-3">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình ảnh phòng trọ
                        </label>
                        <div className="border-2 border-dashed border-primary/40 rounded-md p-1 flex justify-center items-center mb-2">
                            <div className="text-gray-500 text-sm text-center">
                                <p>ĐĂNG TỪ 05 ĐẾN 09 HÌNH</p>
                                <ImageUploader
                                    variant="outline" className="mt-2"
                                    label="Ảnh nhà trọ "
                                    minFiles={5}
                                    maxFiles={9}

                                    onUploadSuccess={(uploadedImages) => {
                                        // Kiểm tra dữ liệu uploadedImages
                                        console.log("Dữ liệu ảnh đã upload:", uploadedImages);

                                        // Cập nhật formData với images mới nhận được từ upload
                                        setFormData({ ...formData, images: uploadedImages });

                                        // Kiểm tra dữ liệu trong formData sau khi cập nhật
                                        console.log("Dữ liệu formData sau khi cập nhật:", { ...formData, images: uploadedImages });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="border-2 border-dashed border-primary/40 rounded-md p-1 flex justify-center items-center mb-2">
                            <div className="text-gray-500 text-sm text-center">
                                <ImageUploader
                                    variant="outline"
                                    className="mt-2"
                                    label="Ảnh giấy chứng nhận PCCC"
                                    maxFiles={1}
                                    onUploadSuccess={(uploadedImages) => {
                                        // uploadedImages là mảng, lấy phần tử đầu tiên
                                        setFormData({ ...formData, licensePcccUrl: uploadedImages[0] });
                                    }}
                                />

                            </div>
                        </div>
                        <div className="border-2 border-dashed border-primary/40 rounded-md p-1 flex justify-center items-center">
                            <div className="text-gray-500 text-sm text-center">
                                <ImageUploader
                                    variant="outline"
                                    className="mt-2"
                                    label="Ảnh giấy phép kinh doanh"
                                    maxFiles={1}
                                    onUploadSuccess={(uploadedImages) => {
                                        // uploadedImages là mảng, lấy URL đầu tiên
                                        setFormData({ ...formData, licenseBusinessUrl: uploadedImages[0] });
                                    }}
                                />

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-7">
                    <div className="gap-4 mb-6">


                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Địa chỉ nhà trọ
                        </label>
                        <Input
                            value={
                                address.houseNumber || address.street || address.commune || address.district || address.province
                                    ? `${address.houseNumber ? address.houseNumber + ", " : ""}${address.street ? address.street + ", " : ""}${address.commune ? address.commune + ", " : ""
                                        }${address.district ? address.district + ", " : ""}${address.province ? address.province : ""
                                        }`.replace(/, $/, "") // Loại dấu phẩy thừa ở cuối
                                    : "Chọn tỉnh, thành phố" // Hiển thị khi tất cả rỗng
                            }
                            onClick={() => setIsModalOpen(true)} // Open modal when clicked
                            placeholder="Nhập địa chỉ"
                            readOnly
                        />


                    </div>

                    {/* Thông tin khác */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tình trạng nội thất
                        </label>
                        <Select
                            value={formData.furnitureStatus}
                            onValueChange={(value) => setFormData({ ...formData, furnitureStatus: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn tình trạng nội thất" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FULL">Đầy đủ nội thất</SelectItem>
                                <SelectItem value="EMPTY">Không có nội thất</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                    {/* Diện tích & Giá */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Diện tích
                            </label>
                            <Input placeholder="Nhập diện tích"
                                type="number"
                                min={0}
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giá thuê
                            </label>
                            <Input placeholder="Nhập giá thuê"
                                type="number"
                                min={0}
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số tiền cọc
                            </label>
                            <Input placeholder="Nhập số tiền cọc"
                                type="number"
                                min={0}
                                value={formData.depositAmount}
                                onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số lượng phòng
                            </label>
                            <Input placeholder="Nhập số lượng phòng trọ"
                                type="number"
                                min={0}
                                value={formData.numberOfRooms}
                                onChange={(e) => setFormData({ ...formData, numberOfRooms: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giá điện
                            </label>
                            <Input placeholder="Nhập giá điện"
                                type="number"
                                min={0}
                                value={formData.electricityPrice}
                                onChange={(e) => setFormData({ ...formData, electricityPrice: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giá nước
                            </label>
                            <Input placeholder="Nhập giá nước"
                                type="number"
                                min={0}
                                value={formData.waterPrice}
                                onChange={(e) => setFormData({ ...formData, waterPrice: e.target.value })}
                            />
                        </div>
                    </div>
                    {/* Tiêu đề và Mô tả */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiêu đề tin đăng
                        </label>
                        <Input placeholder="Nhập tiêu đề"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả chi tiết
                        </label>
                        <Textarea placeholder="Nhập mô tả chi tiết..." rows={5}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between">
                        <Button variant="outline">Xem trước</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Đang đăng..." : "Đăng tin"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                address={address}
                onAddressChange={handleAddressChange}
                onSave={handleSaveAddress}
            />
            {/* Dialog cảnh báo vượt giới hạn */}
            <Dialog open={isLimitDialogOpen} onOpenChange={setIsLimitDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bạn đã hết lượt đăng bài</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Vui lòng mua thêm lượt để tiếp tục đăng tin mới.
                    </p>
                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsLimitDialogOpen(false)}
                        >
                            Đóng
                        </Button>
                        <a href="/users/postpackage">
                            <Button>Thêm lượt đăng</Button>
                        </a>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Post;
