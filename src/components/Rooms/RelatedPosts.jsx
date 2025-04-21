import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "@/apis/axiosClient";
import Room1 from "../../assets/room1.jpg";
import { GrLocation } from "react-icons/gr";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const RelatedPosts = ({ currentPostId }) => {
    const [relatedRooms, setRelatedRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedRooms = async () => {
            try {
                const response = await axiosClient.getOne(`/post/${currentPostId}/similar`);
                setRelatedRooms(response.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy bài viết liên quan:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentPostId) fetchRelatedRooms();
    }, [currentPostId]);

    // Hàm cuộn về đầu trang khi nhấn vào bài viết
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return <div>Đang tải bài viết liên quan...</div>;
    }

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Bài viết liên quan</h2>
            {relatedRooms.length > 0 ? (
                <Carousel className="w-full">
                    <CarouselContent className="flex">
                        {relatedRooms.map((room, index) => (
                            <CarouselItem key={room.id || `room-${index}`} className="basis-1/3 px-2">
                                <div className="border rounded-md hover:shadow-lg transform hover:scale-[1.03] ease-in-out">
                                    <img
                                        src={room?.featuredImage || Room1}
                                        alt="Room"
                                        className="w-full h-[180px] rounded-t-md object-cover"
                                    />
                                    <div className="p-4 flex flex-col gap-2">
                                        <Link
                                            to={`/roomdetail/${room.postUuid}`}
                                            className="text-base font-bold text-gray-700 truncate hover:underline"
                                            onClick={handleClick} // Gọi hàm khi nhấn vào bài viết
                                        >
                                            {room?.title}
                                        </Link>
                                        <span className="text-sm flex items-center gap-1 font-bold text-main-500">
                                            <GrLocation size={18} className="text-green-600" />
                                            <span>{`${room.ward || ""}, ${room.district || ""}, ${room.city || ""}`}</span>
                                        </span>
                                        <span className="text-text-base flex items-center gap-1 font-bold text-main-500">
                                            {room?.price?.toLocaleString() || "Giá không xác định"} VNĐ
                                        </span>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            ) : (
                <p className="text-gray-500">Không có bài viết liên quan.</p>
            )}
        </div>
    );
};

export default RelatedPosts;
