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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Post = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();
    const [postCount, setPostCount] = useState(null);
    const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
    const [agreePolicy, setAgreePolicy] = useState(false);

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
        licenseBusinessUrl: '',
        allowDeposit: false,
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
        if (isSubmitting) return;

        if (postCount <= 0) {
            setIsLimitDialogOpen(true);
            return;
        }

        if (!formData.title || !formData.description || !formData.furnitureStatus || !formData.price || !formData.area || !formData.depositAmount || !formData.numberOfRooms || !formData.electricityPrice || !formData.waterPrice) {
            toast({ title: "Thông báo", description: "Vui lòng điền đầy đủ thông tin!" });
            return;
        }

        if (formData.allowDeposit && !agreePolicy) {
            toast({ title: "Thông báo", description: "Bạn phải đồng ý với điều khoản đặt cọc!" });
            return;
        }

        // Kiểm tra bắt buộc phải có ít nhất 5 ảnh nhà trọ
        if (!formData.images || formData.images.length < 5) {
            toast({ title: "Thông báo", description: "Vui lòng tải lên ít nhất 5 ảnh nhà trọ!" });
            return;
        }

        const numericFields = [
            { label: "Diện tích", value: formData.area },
            { label: "Giá thuê", value: formData.price },
            { label: "Số tiền cọc", value: formData.depositAmount },
            { label: "Số lượng phòng", value: formData.numberOfRooms },
            { label: "Giá điện", value: formData.electricityPrice },
            { label: "Giá nước", value: formData.waterPrice },
        ];

        for (const field of numericFields) {
            if (parseFloat(field.value) < 0) {
                toast({
                    title: "Thông báo",
                    description: `${field.label} không được là số âm!`,
                });
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const data = new FormData();

            // Sửa lại cách append ảnh - lấy file từ object ảnh
            formData.images.forEach((imageObj) => {
                data.append("images", imageObj.file);
            });

            // Sửa lại cách append giấy phép - lấy file từ object
            if (formData.licensePcccUrl?.file) {
                data.append("licensePccc", formData.licensePcccUrl.file);
            }

            if (formData.licenseBusinessUrl?.file) {
                data.append("licenseBusiness", formData.licenseBusinessUrl.file);
            }

            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("depositAmount", parseFloat(formData.depositAmount) || 0);
            data.append("price", parseFloat(formData.price) || 0);
            data.append("area", parseFloat(formData.area) || 0);
            data.append("furnitureStatus", formData.furnitureStatus);
            data.append("numberOfRooms", parseInt(formData.numberOfRooms, 10) || 0);
            data.append("electricityPrice", parseFloat(formData.electricityPrice) || 0);
            data.append("waterPrice", parseFloat(formData.waterPrice) || 0);
            data.append("city", address.province || "UNKNOWN");
            data.append("district", address.district || "UNKNOWN");
            data.append("ward", address.commune || "UNKNOWN");
            data.append("street", address.street || "");
            data.append("houseNumber", address.houseNumber || "");
            data.append("allowDeposit", formData.allowDeposit);

            const response = await axiosClient.postMultipart("/post/create-with-images", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response) {
                toast({ description: "Tin đã được gửi để được phê duyệt!" });
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (error) {
            console.error("Network Error:", error);
            toast({ description: "Có lỗi xảy ra khi kết nối đến server. Vui lòng thử lại." });
        } finally {
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

                                    onImagesChange={(uploadedImages) => {
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
                                    onImagesChange={(uploadedImages) => {
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
                                    onImagesChange={(uploadedImages) => {
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

                    {/* Thanh kéo/toggle cho phép đặt cọc */}
                    <div className="mb-6 flex items-center gap-3">
                        <Switch
                            id="allowDeposit"
                            checked={formData.allowDeposit}
                            onCheckedChange={checked => setFormData({ ...formData, allowDeposit: !!checked })}
                        />
                        <Label htmlFor="allowDeposit">Cho phép đặt cọc trực tuyến</Label>
                    </div>
                    {/* Nếu cho phép đặt cọc thì hiện tickbox điều khoản */}
                    {formData.allowDeposit && (
                        <div className="mb-6 flex items-center gap-3">
                            <Checkbox
                                id="agreePolicy"
                                checked={agreePolicy}
                                onCheckedChange={setAgreePolicy}
                            />
                            <Label htmlFor="agreePolicy" className="text-sm">
                                Tôi đã đọc và đồng ý với{' '}
                                <a
                                    href="/deposit-terms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline hover:text-primary/80 transition-colors"
                                >
                                    điều khoản đặt cọc
                                </a>.
                            </Label>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end">
                        {/* <Button variant="outline">Xem trước</Button> */}
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
