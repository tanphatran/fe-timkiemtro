import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoFlashOutline } from "react-icons/io5"; // Icon điện
import { BsDroplet } from "react-icons/bs"; // Icon nước
import { MdSquareFoot } from "react-icons/md"; // Icon diện tích
import { GrLocation } from "react-icons/gr";

const PostCard = ({ post, onEdit }) => {
    return (
        <Card className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mb-4 h-auto shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 transform hover:scale-[1.02] ease-in-out">
            <CardHeader className="p-1 col-span-2">
                <img
                    src={post?.featuredImage}
                    alt="Post Image"
                    className="w-32 h-32 object-cover rounded-t-lg"
                />
            </CardHeader>
            <CardContent className="p-2 col-span-8 justify-center">
                <CardTitle className="text-base font-semibold text-gray-900">{post.title}</CardTitle>
                <p className="text-sm font-bold text-black mt-2">Giá tiền: {post.price}</p>
                <p className="text-sm text-gray-600 mt-2 flex flex-wrap items-center gap-2 ">
                    <span className="flex gap-2 items-center text-gray-500">
                        <IoFlashOutline size={15} />
                        <span className="font-medium text-sm">Giá điện: {post?.electricityPrice?.toLocaleString()} đ/kWh
                        </span>
                    </span>

                    {/* Giá nước */}
                    <span className="flex gap-2 items-center text-gray-500">
                        <BsDroplet size={15} />
                        <span className="font-medium text-sm">
                            Giá nước: {post?.waterPrice?.toLocaleString()} đ/m³
                        </span>
                    </span>

                    {/* Diện tích */}
                    <span className="flex gap-2 items-center text-gray-500">
                        <MdSquareFoot size={18} />
                        <span className="font-medium text-sm">
                            Diện tích: {post?.area} m<sup>2</sup>
                        </span>
                    </span></p>

                <p className="flex items-center text-sm text-black mt-2">
                    <span className="mr-2">
                        <GrLocation size={15} />
                    </span>
                    <span>Địa chỉ phòng: {post.location}</span>
                </p>


            </CardContent>
            <div className="p-4 flex justify-center items-center col-span-2">
                <Button
                    variant="outline"
                    className="text-primary hover:bg-primary hover:text-white transition duration-200"
                    onClick={() => onEdit(post)} // Callback để mở dialog
                >
                    Chỉnh sửa
                </Button>

            </div>
        </Card>
    );
};

export default PostCard;