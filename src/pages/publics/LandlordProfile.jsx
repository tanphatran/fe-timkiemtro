import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "@/apis/axiosClient";
import LandlordInfo from "@/components/Landlord/LandlordInfo";
import RoomList from "@/components/Landlord/RoomList";


const LandlordProfile = () => {
    const { id } = useParams();
    const [landlord, setLandlord] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const result = await axiosClient.getOne(`/user/${id}`);
                setLandlord(result.data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu chủ nhà:", error);
            }
        };

        const fetchRooms = async () => {
            try {
                const result = await axiosClient.getOne(`/post/user/${id}`); // Sửa lỗi thiếu dấu backtick
                const content = result.data || []; // Đảm bảo lấy dữ liệu từ `content`

                // Format dữ liệu trước khi set state
                const formattedRooms = content.map((room) => ({
                    id: room.postUuid,
                    featuredImage: room.postImages?.[0] || "",
                    name: room.title,
                    price: room.price,
                    electricityPrice: room.electricityPrice,
                    waterPrice: room.waterPrice,
                    size: room.area,
                    time: new Date(room.createdAt).toLocaleDateString("vi-VN"),
                    houseNumber: room.houseNumber,
                    street: room.street,
                    ward: room.ward,
                    district: room.district,
                    city: room.city,
                }));

                setRooms(formattedRooms);
            } catch (error) {
                console.error("Lỗi khi tải danh sách phòng:", error);
            }
        };




        fetchLandlord();
        fetchRooms();
    }, [id]);

    if (!landlord) return <p className="text-center">Đang tải...</p>;

    return (
        <div className="max-w-6xl mt-14 mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cột bên trái: Thông tin chủ nhà */}
            <div className="space-y-6">
                <LandlordInfo landlord={landlord} />
            </div>

            {/* Cột bên phải: Danh sách phòng (chiếm 2 cột) */}
            <div className="md:col-span-2">
                <RoomList rooms={rooms} />
            </div>
        </div>
    );
};

export default LandlordProfile;
