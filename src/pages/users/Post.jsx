import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const Post = () => {
    return (
        <div className="mt-14 max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md">

            <h1 className="text-lg font-semibold mb-4 ">Đăng tin phòng trọ</h1>
            <div className="grid my-8 grid-cols-10 gap-4">
                {/* Cột chính */}
                <div className="col-span-3">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình ảnh phòng trọ
                        </label>
                        <div className="border-2 border-dashed border-primary    rounded-md p-4 flex justify-center items-center">
                            <div className="text-gray-500 text-sm text-center">
                                <p>ĐĂNG TỪ 05 ĐẾN 10 HÌNH</p>
                                <Button variant="outline" className="mt-2">
                                    Tải ảnh lên
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-span-7">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục tin đăng
                            </label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bat-dong-san">Bất động sản - Phòng trọ</SelectItem>
                                    <SelectItem value="khac">Loại khác</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Địa chỉ BĐS
                            </label>
                            <Input placeholder="Nhập địa chỉ" />
                        </div>
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
            {/* Hình ảnh và Video */}


            {/* Danh mục và Địa chỉ */}

        </div>
    )
}

export default Post