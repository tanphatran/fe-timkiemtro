import React, { useState, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { IoFlashOutline } from "react-icons/io5"; // Icon điện
import { BsDroplet } from "react-icons/bs"; // Icon nước
import { MdSquareFoot } from "react-icons/md"; // Icon diện tích
import Room1 from "../../assets/room1.jpg";
import { Link } from "react-router-dom";
import pathnames from '@/lib/pathnames'
import { GrLocation } from "react-icons/gr";
import axiosClient from "@/apis/axiosClient";
import useAuth from "@/hooks/useAuth";

const RoomCard = ({ room }) => {
    const [liked, setLiked] = useState(false); // Trạng thái thích
    const { isLoggedIn } = useAuth();
    const checkFavoriteStatus = async () => {
        try {
            if (!isLoggedIn) {
                setLiked(false);
                return;
            }
            const response = await axiosClient.getOne(`/favorite-posts/check-favorite/${room.id}`);
            // Nếu bài viết đã được yêu thích, cập nhật trạng thái liked

            setLiked(response.data); // data là true nếu đã yêu thích, false nếu chưa

        } catch (error) {
            console.error("Error checking favorite status:", error);
        }
    };
    const handleFavorite = async () => {
        try {
            if (!isLoggedIn) {
                return;
            }
            if (liked) {
                // Gọi API xóa bài viết yêu thích
                const response = await axiosClient.delete(`/favorite-posts/remove/${room.id}`);
                console.log("Remove Favorite API response:", response.data);
            } else {
                // Gọi API thêm bài viết vào danh sách yêu thích
                const response = await axiosClient.post(`/favorite-posts/create/${room.id}`);
                console.log("Add Favorite API response:", response.data);
            }

            // Cập nhật trạng thái yêu thích
            setLiked(!liked); // Cập nhật trạng thái yêu thích trước (optimistic UI)
        } catch (error) {
            console.error("Error updating favorite status:", error);
            // Nếu API thất bại, rollback trạng thái thích
            setLiked(!liked);
        }
    };
    useEffect(() => {
        checkFavoriteStatus();
    }, [isLoggedIn, room.id]);

    return (
        <div className="border rounded-md hover:shadow-lg transform hover:scale-[1.03] ease-in-out">
            {/* Hình ảnh */}
            <img
                src={room?.featuredImage || Room1}
                alt="Room"
                className="w-full h-[240px] rounded-t-md object-cover"
            />

            {/* Nội dung */}
            <div className="p-4 flex flex-col gap-2">

                <Link to={pathnames.publics.roomdetail_id.replace(":id", room.id)}
                    className="text-lg font-bold text-gray-700 truncate hover:underline"
                    style={{ maxWidth: "45ch" }}
                >
                    {room?.name}
                </Link>
                <span className="text-text-base	 flex items-center gap-1 font-bold text-main-500">
                    <span className="text-green-600">
                        <GrLocation size={18} />
                    </span>
                    <span>{` ${room.ward}, ${room.district}, ${room.city}`}</span>
                </span>
                <span className="text-text-base	 flex items-center gap-1 font-bold text-main-500">
                    {room?.price?.toLocaleString()} VNĐ
                </span>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    {/* Giá điện */}
                    <span className="flex gap-2 items-center text-gray-500">
                        <IoFlashOutline size={20} />
                        <span className="font-medium text-base">
                            {room?.electricityPrice?.toLocaleString()} đ/kWh
                        </span>
                    </span>

                    {/* Giá nước */}
                    <span className="flex gap-2 items-center text-gray-500">
                        <BsDroplet size={20} />
                        <span className="font-medium text-base">
                            {room?.waterPrice?.toLocaleString()} đ/m³
                        </span>
                    </span>

                    {/* Diện tích */}
                    <span className="flex gap-2 items-center text-gray-500">
                        <MdSquareFoot size={20} />
                        <span className="font-medium text-base">
                            {room?.size} m<sup>2</sup>
                        </span>
                    </span>
                </div>
            </div>

            {/* Phần thời gian và trái tim */}
            <div className="p-2 flex justify-between items-center border-t border-gray-200">
                {/* Hiển thị thời gian từ dữ liệu */}
                <span className="text-sm text-gray-500">{room?.time}</span>

                {/* Icon trái tim */}
                <button
                    onClick={handleFavorite}
                    className="text-gray-500 hover:text-red-500 transition"
                >
                    {liked ? (
                        <AiFillHeart size={24} className="text-red-500" />
                    ) : (
                        <AiOutlineHeart size={24} />
                    )}
                </button>
            </div>
        </div>
    );
};

export default RoomCard;
