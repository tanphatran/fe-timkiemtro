import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { IoFlashOutline } from "react-icons/io5"; // Icon điện
import { BsDroplet } from "react-icons/bs"; // Icon nước
import { MdSquareFoot } from "react-icons/md"; // Icon diện tích
import { GrLocation } from "react-icons/gr";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axiosClient from "@/apis/axiosClient";

const FavoriteCard = ({ post, refreshFavoritePosts }) => {
    const [liked, setLiked] = useState(true);
    const featuredImage =
        post?.postImages?.[0] || "https://via.placeholder.com/150";

    const handleRemoveFavorite = async () => {
        try {
            await axiosClient.delete(`/favorite-posts/remove/${post.postUuid}`);
            refreshFavoritePosts();
            setLiked(false);
        } catch (error) {
            console.error("Error updating favorite status:", error);
        }
    };

    return (
        <Card className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mb-4 h-auto shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 transform hover:scale-[1.02] ease-in-out">
            <CardHeader className="p-1 col-span-2">
                <img
                    src={featuredImage}
                    alt="Post Image"
                    className="w-32 h-32 object-cover rounded-t-lg"
                />
            </CardHeader>

            <CardContent className="p-2 col-span-8 justify-center">
                <CardTitle className="text-base font-semibold text-gray-900">
                    {post?.title || "Không có tiêu đề"}
                </CardTitle>
                <p className="text-sm font-bold text-black mt-2">
                    Giá tiền: {post?.price?.toLocaleString()} đ
                </p>
                <p className="text-sm text-gray-600 mt-2 flex flex-wrap items-center gap-2 ">
                    <span className="flex gap-2 items-center text-gray-500">
                        <IoFlashOutline size={15} />
                        <span className="font-medium text-sm">
                            Giá điện: {post?.electricityPrice?.toLocaleString()} đ/kWh
                        </span>
                    </span>

                    <span className="flex gap-2 items-center text-gray-500">
                        <BsDroplet size={15} />
                        <span className="font-medium text-sm">
                            Giá nước: {post?.waterPrice?.toLocaleString()} đ/m³
                        </span>
                    </span>

                    <span className="flex gap-2 items-center text-gray-500">
                        <MdSquareFoot size={18} />
                        <span className="font-medium text-sm">
                            Diện tích: {post?.area} m<sup>2</sup>
                        </span>
                    </span>
                </p>

                <p className="flex items-center text-sm text-black mt-2">
                    <span className="mr-2">
                        <GrLocation size={15} />
                    </span>
                    <span>
                        Địa chỉ phòng: {post?.ward}, {post?.district}, {post?.city}
                    </span>
                </p>
            </CardContent>

            <div className="p-4 flex justify-center items-center col-span-2">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${liked
                                    ? "bg-red-100 hover:bg-red-200"
                                    : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {liked ? (
                                <AiFillHeart
                                    size={28}
                                    className="text-red-500 hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <AiOutlineHeart
                                    size={28}
                                    className="text-gray-500 hover:scale-110 transition-transform duration-300"
                                />
                            )}
                        </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Bạn có chắc muốn bỏ yêu thích bài viết này?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Hành động này sẽ xóa bài viết khỏi danh sách yêu thích của bạn.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRemoveFavorite}>
                                Đồng ý
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
    );
};

export default FavoriteCard;
