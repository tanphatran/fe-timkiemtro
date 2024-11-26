import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Images from "@/components/Rooms/Images.jsx";
import { GrLocation } from "react-icons/gr";
import { AiFillMessage, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdLocalPhone } from "react-icons/md";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import ReportRoom from "@/components/Rooms/ReportRoom";
import axiosClient from "@/apis/axiosClient";

const RoomDetail = () => {
    const { id } = useParams(); // Lấy id từ URL
    const [room, setRoom] = useState(null); // Dữ liệu phòng
    const [liked, setLiked] = useState(false); // Trạng thái thích
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(null); // Lỗi khi gọi API

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axiosClient.getOne(`/post/${id}`);
                setRoom(response.data); // Lưu dữ liệu bài đăng
            } catch (err) {
                setError("Không thể tải dữ liệu phòng!");
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchRoomDetails();
    }, [id]);

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!room) {
        return <div>Phòng không tồn tại!</div>;
    }

    return (
        <div className="w-full mt-16">
            <div className="w-main pb-4 mx-28">
                {/* Hiển thị hình ảnh */}
                {room.postImages && <Images images={room.postImages} />}

                <div className="grid my-8 grid-cols-10 gap-4">
                    {/* Cột chính */}
                    <div className="col-span-7">
                        <h1 className="font-bold text-2xl line-clamp-2">{room.title}</h1>
                        <h1 className="font-bold text-xl">{room.price.toLocaleString()} VND/tháng</h1>
                        <span className="flex items-center gap-3 mt-2">
                            <span className="text-green-600">
                                <GrLocation size={18} />
                            </span>
                            <span>{`${room.houseNumber}, ${room.street}, ${room.ward}, ${room.district}, ${room.city}`}</span>
                        </span>

                        <div className="my-4">
                            <p>{room.description}</p>
                        </div>

                        {/* Bảng thông tin */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Thông tin về phòng trọ</h3>
                            <Table className="text-base">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Thông tin</TableHead>
                                        <TableHead>Chi tiết</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Giá thuê</TableCell>
                                        <TableCell>{room.price.toLocaleString()} VND/tháng</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Giá điện</TableCell>
                                        <TableCell>{room.electricityPrice.toLocaleString()} VND/kWh</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Giá nước</TableCell>
                                        <TableCell>{room.waterPrice.toLocaleString()} VND/m³</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-end">
                            <ReportRoom />
                        </div>
                    </div>

                    {/* Cột tùy chọn */}
                    <div className="col-span-3">
                        <div className="p-4 border rounded-lg shadow-md bg-white">
                            {/* Thông tin liên hệ */}
                            <div className="mb-4">
                                <button className="flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-white border border-primary rounded-lg hover:bg-gray-100">
                                    <MdLocalPhone className="text-primary hover:text-primary-dark size-6" />
                                    <span>0911 649 xxx</span>
                                    <span className="text-sm text-primary font-bold">Bấm để hiện số</span>
                                </button>
                            </div>

                            <div className="mb-4">
                                <button className="flex items-center justify-center w-full px-4 py-2 text-gray-700 bg-white border border-primary/50 rounded-lg hover:bg-gray-100">
                                    <AiFillMessage className="text-primary hover:text-primary-dark size-6 mr-3" />
                                    <span> Gửi tin nhắn</span>
                                </button>
                            </div>
                        </div>
                        <div className="my-4 flex justify-center items-center">
                            <button
                                onClick={() => setLiked(!liked)}
                                className="flex items-center justify-center w-1/2 px-4 py-2 text-gray-700 bg-white border border-primary/50 rounded-lg hover:bg-gray-100"
                            >
                                {liked ? (
                                    <AiFillHeart size={24} className="text-red-500 mr-2" />
                                ) : (
                                    <AiOutlineHeart size={24} className="mr-2" />
                                )}
                                <span>Lưu tin</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;
