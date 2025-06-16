import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IoFlashOutline } from "react-icons/io5";
import { BsDroplet } from "react-icons/bs";
import { MdSquareFoot } from "react-icons/md";
import { GrLocation } from "react-icons/gr";

const MyDepositPostCard = ({ post, onRefresh }) => {
    return (
        <Card className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mb-4 h-auto shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-1 col-span-2">
                <img
                    src={post?.postImages[0] || 'default-image-url.jpg'}
                    alt="Post Image"
                    className="w-32 h-32 object-cover rounded-t-lg"
                />
            </CardHeader>
            <CardContent className="p-2 col-span-10 justify-center">
                <CardTitle className="text-base font-semibold text-gray-900">{post.title}</CardTitle>
                <p className="text-sm font-bold text-black mt-2">Giá tiền: {post.price.toLocaleString()} đ</p>
                <p className="text-sm text-gray-600 mt-2 flex flex-wrap items-center gap-2">
                    <span className="flex gap-2 items-center text-gray-500">
                        <IoFlashOutline size={15} />
                        <span className="font-medium text-sm">
                            Giá điện: {post?.electricityPrice ? post.electricityPrice.toLocaleString() : 'Chưa có thông tin'} đ/kWh
                        </span>
                    </span>
                    <span className="flex gap-2 items-center text-gray-500">
                        <BsDroplet size={15} />
                        <span className="font-medium text-sm">
                            Giá nước: {post?.waterPrice ? post.waterPrice.toLocaleString() : 'Chưa có thông tin'} đ/m³
                        </span>
                    </span>
                    <span className="flex gap-2 items-center text-gray-500">
                        <MdSquareFoot size={18} />
                        <span className="font-medium text-sm">
                            Diện tích: {post?.area || 'Chưa có thông tin'} m<sup>2</sup>
                        </span>
                    </span>
                </p>
                <p className="flex items-center text-sm text-black mt-2">
                    <span className="mr-2">
                        <GrLocation size={15} />
                    </span>
                    <span>Địa chỉ phòng: {post.city}, {post.district}, {post.ward}</span>
                </p>
            </CardContent>
        </Card>
    );
};

export default MyDepositPostCard; 