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
    const [userData, setUserData] = useState(null); // Dữ liệu người dùng
    const [liked, setLiked] = useState(false); // Trạng thái thích
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(null); // Lỗi khi gọi API
    const [isRevealed, setIsRevealed] = useState(false);
    const handleFavorite = async () => {
        try {
            setLiked(!liked); // Cập nhật trạng thái thích trước (optimistic UI)

            // Gọi API thêm hoặc xóa khỏi danh sách yêu thích
            const response = await axiosClient.post(`/favorite-posts/create/${id}`);

            console.log("Favorite API response:", response.data);
        } catch (error) {
            console.error("Error updating favorite status:", error);
            // Nếu API thất bại, rollback trạng thái thích
            setLiked(!liked);
        }
    };
    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axiosClient.getOne(`/post/detail/${id}`);
                setRoom(response.data); // Lưu dữ liệu bài đăng

                // Gọi thêm thông tin người dùng từ API
                const userResponse = await axiosClient.getOne(`/post/${id}/user`);
                setUserData(userResponse.data);
            } catch (err) {
                setError("Không thể tải dữ liệu phòng hoặc người dùng!");
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchRoomDetails();
    }, [id]);
    // useEffect(() => {
    //     const fetchFavoriteStatus = async () => {
    //         try {
    //             const response = await axiosClient.post(`/favorite-posts/status/${id}`);
    //             setLiked(response.data.isFavorite); // Cập nhật trạng thái yêu thích từ API
    //         } catch (error) {
    //             console.error("Error fetching favorite status:", error);
    //         }
    //     };

    //     fetchFavoriteStatus();
    // }, [id]);

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!room) {
        return <div>Phòng không tồn tại!</div>;
    }

    // Số điện thoại đầy đủ
    const fullPhone = userData?.phoneNumber || "N/A";
    const hiddenPhone = fullPhone.slice(0, -3) + "xxx";
    const displayedPhone = isRevealed ? fullPhone : hiddenPhone;

    return (
        <div className="w-full mt-16 px-4 sm:px-8 lg:px-28">
            <div className="w-full max-w-screen-xl mx-auto">
                {/* Hiển thị hình ảnh */}
                {room.postImages && <Images images={room.postImages} />}

                <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mt-8">
                    {/* Cột chính */}
                    <div className="lg:col-span-7">
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
                                    <TableRow>
                                        <TableCell>Diện tích</TableCell>
                                        <TableCell>{room.area.toLocaleString()} m<sup>2</sup></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Ngày đăng bài</TableCell>
                                        <TableCell>{new Date(room.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-end">
                            <ReportRoom />
                        </div>
                    </div>

                    {/* Cột tùy chọn */}
                    <div className="lg:col-span-3">
                        <div className="p-4 border rounded-lg shadow-md bg-white">
                            {/* Avatar và thông tin */}
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={userData?.profilePicture || "https://via.placeholder.com/50"}
                                    alt="Avatar"
                                    className="w-12 h-12 rounded-full border border-gray-300"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {userData?.fullName || "Tên không xác định"}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Ngày tham gia:{" "}
                                        {userData?.createdAt
                                            ? new Date(userData.createdAt).toLocaleDateString("vi-VN")
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Thông tin liên hệ */}
                            <div className="mb-4">
                                <button
                                    className="flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-white border border-primary rounded-lg hover:bg-gray-100"
                                    onClick={() => setIsRevealed(true)}
                                >
                                    <MdLocalPhone className="text-primary hover:text-primary-dark size-6" />
                                    <span>{displayedPhone}</span>
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

                        {/* Lưu tin */}
                        <div className="my-4 flex justify-center items-center">
                            <button
                                onClick={handleFavorite} // Gắn hàm xử lý
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
