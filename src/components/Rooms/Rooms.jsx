import React, { useState, useEffect } from "react";
import RoomCard from "@/components/Rooms/RoomCard";
import SearchFilter from "@/components/Searchs/SearchFilter";
import axiosClient from "@/apis/axiosClient"; // Đường dẫn tới apiClient.js
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const Rooms = () => {
    const [sortOption, setSortOption] = useState("default"); // Lựa chọn sắp xếp
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 9; // Số phòng hiển thị mỗi trang
    const [rooms, setRooms] = useState([]); // Dữ liệu phòng
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [loading, setLoading] = useState(false); // Trạng thái loading

    // Hàm gọi API
    const fetchRooms = async (page) => {
        setLoading(true);
        try {
            const response = await axiosClient.getMany("/post", {
                page: page - 1,
                size: itemsPerPage,
            });

            console.log("API Response:", response);

            const { content, totalPages } = response.data || {};
            if (!content || !totalPages) {
                throw new Error("API response does not have expected structure");
            }

            const formattedRooms = content.map((room) => ({
                id: room.postUuid,
                featuredImage: room.postImages[0],
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
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Error fetching rooms:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi component mount hoặc khi trang thay đổi
    useEffect(() => {
        fetchRooms(currentPage);
    }, [currentPage]);

    // Xử lý thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="mt-4 px-2 sm:px-8 md:px-16 lg:px-28">
            <div className="w-full">
                <div className="w-full max-w-screen-xl mx-auto">
                    {/* Danh sách phòng */}
                    <h1 className="text-xl font-bold">Danh sách tất cả các phòng trọ</h1>

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {loading ? (
                            <p className="text-center w-full">Đang tải dữ liệu...</p>
                        ) : (
                            rooms.map((room) => <RoomCard key={room.id} room={room} />)
                        )}
                    </div>

                    {/* Phân trang */}
                    <Pagination className="mt-6 mb-4">
                        <PaginationContent className="flex justify-center space-x-2">
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 border rounded-md"
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href="#"
                                        isActive={index + 1 === currentPage}
                                        onClick={() => handlePageChange(index + 1)}
                                        className="px-3 py-2 border rounded-md"
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() =>
                                        handlePageChange(Math.min(totalPages, currentPage + 1))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 border rounded-md"
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
};

export default Rooms;
