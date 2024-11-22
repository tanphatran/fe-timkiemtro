import React, { useState } from "react"; // Import useState
import { useParams } from "react-router-dom"; // Import useParams
import Images from "@/components/Rooms/Images.jsx";
import { GrLocation } from "react-icons/gr";
import { AiFillMessage, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdLocalPhone } from "react-icons/md";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"; // Import bảng từ shadcn ui
import Room1 from "@/assets/room1.jpg";
import Room2 from "@/assets/room2.jpg";
import Room3 from "@/assets/room3.jpg";
import Room4 from "@/assets/room4.jpg";
import Room5 from "@/assets/room5.jpg";
import Room6 from "@/assets/room6.jpg";
import ReportRoom from "@/components/Rooms/ReportRoom";

const RoomDetail = () => {
    const { id } = useParams(); // Lấy id từ URL
    const [liked, setLiked] = useState(false); // Trạng thái thích

    // Dữ liệu chi tiết phòng
    const roomDetails = {
        1: {
            name: "CHO THUÊ NHÀ ĐƯỜNG NGUYỄN ĐÌNH QUÂN P5 ĐÀ LẠT",
            address: "123 Lã Xuân Oai, Quận 9, TP.HCM",
            description: "Phòng trọ cao cấp đầy đủ tiện nghi, gần các trường học FPT, HUTECH, Samsung Quận 9.",
            price: 3800000,
            electricityPrice: 3500, // Giá điện tính theo kWh
            waterPrice: 15000, // Giá nước tính theo m³
            images: [Room1, Room2, Room3, Room6, Room4, Room5], // Dữ liệu ảnh phòng
        },
    };

    const room = roomDetails[parseInt(id)]; // Ép kiểu ID sang số nguyên

    if (!room) {
        return <div>Phòng không tồn tại!</div>;
    }

    return (
        <div className="w-full mt-16">
            <div className="w-main  pb-4 mx-28">
                {/* Hiển thị hình ảnh */}
                {room?.images && <Images images={room.images} />}

                {/* Grid layout cho nội dung */}
                <div className="grid my-8 grid-cols-10 gap-4">
                    {/* Cột chính chứa thông tin chi tiết */}
                    <div className="col-span-7">
                        <h1 className="font-bold text-2xl line-clamp-2">{room.name}</h1>
                        <h1 className="font-bold text-xl line-clamp-2">{room.price.toLocaleString()} VND/tháng</h1>

                        <span className="flex items-center gap-3 mt-2">
                            <span className="text-green-600">
                                <GrLocation size={18} />
                            </span>
                            <span>{room.address}</span>
                        </span>
                        {/* Mô tả chi tiết */}
                        <div className="my-4">
                            <p>{room.description}</p>
                        </div>

                        {/* Bảng thông tin chi tiết */}
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
                                        <TableCell>Giá thuê phòng</TableCell>
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
                            {/* Avatar và thông tin người đăng */}
                            <div className="flex items-center mb-4">
                                <img
                                    src="https://via.placeholder.com/50"
                                    alt="Avatar"
                                    className="w-12 h-12 rounded-full mr-3"
                                />
                                <div>
                                    <h3 className="font-bold text-lg">Nguyễn Văn A </h3>
                                    <span className="text-sm text-gray-500">Đã tham gia: 2 năm 1 tháng</span>
                                </div>
                            </div>

                            {/* Thông tin liên hệ */}
                            <div className="mb-4">
                                <button className="flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-white border border-primary rounded-lg hover:bg-gray-100">
                                    <MdLocalPhone className="text-primary hover:text-primary-dark size-6" />
                                    <span>0911 649 xxx</span>
                                    <span className="text-sm  text-primary font-bold">Bấm để hiện số</span>
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
                                onClick={() => setLiked(!liked)} // Thêm sự kiện onClick
                                className="flex items-center justify-center w-1/2 px-4 py-2 text-gray-700 bg-white border border-primary/50 rounded-lg hover:bg-gray-100"
                            >
                                {/* Kiểm tra trạng thái liked và hiển thị icon tương ứng */}
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
