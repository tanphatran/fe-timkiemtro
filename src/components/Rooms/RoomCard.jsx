import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { IoFlashOutline } from "react-icons/io5"; // Icon điện
import { BsDroplet } from "react-icons/bs"; // Icon nước
import { MdSquareFoot } from "react-icons/md"; // Icon diện tích
import Room1 from "../../assets/room1.jpg";

const RoomCard = ({ room }) => {
    const [liked, setLiked] = useState(false); // Trạng thái thích

    return (
        <div className="border rounded-md cursor-pointer hover:shadow-lg">
            {/* Hình ảnh */}
            <img
                src={room?.featuredImage || Room1}
                alt="Room"
                className="w-full h-[240px] rounded-t-md object-cover"
            />

            {/* Nội dung */}
            <div className="p-4 flex flex-col gap-2">
                <h1 className="text-lg font-bold text-gray-700 truncate" style={{ maxWidth: "45ch" }}>
                    {room?.name} </h1>
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
                    onClick={() => setLiked(!liked)}
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
