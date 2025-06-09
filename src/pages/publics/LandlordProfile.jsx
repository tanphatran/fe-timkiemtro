import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "@/apis/axiosClient";
import LandlordInfo from "@/components/Landlord/LandlordInfo";
import RoomList from "@/components/Landlord/RoomList";
import useChatStore from "@/zustand/useChatStore";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const LandlordProfile = () => {
    const { id } = useParams();
    const [landlord, setLandlord] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const { toast } = useToast();

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
            const result = await axiosClient.getOne(`/post/user/${id}`);
            const content = result.data.content || [];

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

    const fetchFollowStatus = async () => {
        try {
            const res = await axiosClient.getOne(`/users/${id}/is-following`);
            setIsFollowing(res.data);
        } catch (err) {
            console.error("Lỗi khi kiểm tra theo dõi:", err);
        }
    };

    useEffect(() => {
        if (id) {
            fetchLandlord();
            fetchRooms();
            fetchFollowStatus();
        }
    }, [id]);

    const handleFollowToggle = async () => {
        if (!isLoggedIn) {
            toast({ description: "Vui lòng đăng nhập để sử dụng chức năng này!" });
            return;
        }
        try {
            if (isFollowing) {
                await axiosClient.delete(`/users/${id}/unfollow`);
            } else {
                await axiosClient.post(`/users/${id}/follow`);
            }
            setIsFollowing(!isFollowing);
        } catch (err) {
            console.error("Lỗi khi thay đổi trạng thái theo dõi:", err);
        }
    };

    // Hàm nhắn tin
    const handleSendMessage = () => {
        if (!isLoggedIn) {
            toast({ description: "Vui lòng đăng nhập để sử dụng chức năng này!" });
            return;
        }
        if (landlord) {
            useChatStore.getState().setPartner(
                landlord.userUuid,
                landlord.fullName,
                landlord.profilePicture,
                landlord.isOnline
            );
            navigate(`/users/chat/${landlord.userUuid}`);
            window.scrollTo(0, 0);
        }
    };

    if (!landlord) return <p className="text-center">Đang tải...</p>;

    return (
        <div className="max-w-6xl mt-14 mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-6">
                <LandlordInfo
                    landlord={landlord}
                    isFollowing={isFollowing}
                    handleFollowToggle={handleFollowToggle}
                    handleSendMessage={handleSendMessage}
                    isLoggedIn={isLoggedIn}
                />
            </div>

            <div className="md:col-span-2">
                <RoomList rooms={rooms} />
            </div>
        </div>
    );
};

export default LandlordProfile;
