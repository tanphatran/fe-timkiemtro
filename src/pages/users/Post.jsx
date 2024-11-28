import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import AddressModal from "@/components/Address/AddressModal" // Import AddressModal
import ImageUploader from "@/components/ImageUploader/ImageUploader";

const Post = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // state to control modal
    const [address, setAddress] = useState({
        province: '',
        district: '',
        commune: '',
        street: '',
        houseNumber: ''
    });

    const handleAddressChange = (newAddress) => {
        setAddress(newAddress);
    };

    const handleSaveAddress = (newAddress) => {
        setAddress(newAddress);
        // Do something with the address, e.g. save it or send it to an API
    };

    return (
        <div className="mt-14 max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h1 className="text-lg font-semibold mb-4 ">Đăng tin phòng trọ</h1>
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
                                />
                            </div>
                        </div>
                        <div className="border-2 border-dashed border-primary/40 rounded-md p-1 flex justify-center items-center mb-2">
                            <div className="text-gray-500 text-sm text-center">
                                <ImageUploader
                                    variant="outline" className="mt-2"
                                    label="Ảnh giấy chứng nhận PCCC "
                                    maxFiles={2}
                                />
                            </div>
                        </div>
                        <div className="border-2 border-dashed border-primary/40 rounded-md p-1 flex justify-center items-center">
                            <div className="text-gray-500 text-sm text-center">
                                <ImageUploader
                                    variant="outline" className="mt-2"
                                    label="Ảnh giấy phép kinh doanh"
                                    maxFiles={2}
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
                        <Input placeholder="Tình trạng nội thất" />
                    </div>

                    {/* Diện tích & Giá */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Diện tích
                            </label>
                            <Input placeholder="Nhập diện tích" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giá thuê
                            </label>
                            <Input placeholder="Nhập giá thuê" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số tiền cọc
                            </label>
                            <Input placeholder="Nhập số tiền cọc" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số lượng phòng
                            </label>
                            <Input placeholder="Nhập số lượng phòng trọ" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giá điện
                            </label>
                            <Input placeholder="Nhập giá điện" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giá nước
                            </label>
                            <Input placeholder="Nhập giá nước" />
                        </div>
                    </div>
                    {/* Tiêu đề và Mô tả */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiêu đề tin đăng
                        </label>
                        <Input placeholder="Nhập tiêu đề" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả chi tiết
                        </label>
                        <Textarea placeholder="Nhập mô tả chi tiết..." rows={5} />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between">
                        <Button variant="outline">Xem trước</Button>
                        <Button>Đăng tin</Button>
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
        </div>
    );
};

export default Post;
