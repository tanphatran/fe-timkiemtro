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

const Search = () => {
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
        <div className="mt-14">
            <SearchFilter />
            <div className="w-full">
                <div className="w-main mx-28">
                    {/* Thanh sắp xếp */}
                    <div className="mb-4 flex justify-normal items-center">
                        <span className="text-base font-semibold text-gray-700 ml-2">Sắp xếp theo: </span>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="border border-gray-300 rounded-md p-1 text-gray-700 focus:outline-primary focus:border-primary"
                        >
                            <option value="default">Mặc định</option>
                            <option value="price">Giá (Thấp đến Cao)</option>
                            <option value="size">Kích thước (Nhỏ đến Lớn)</option>
                            <option value="time">Mới nhất</option>
                        </select>
                    </div>

                    {/* Danh sách phòng */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                        {loading ? (
                            <p>Đang tải dữ liệu...</p>
                        ) : (
                            rooms.map((room) => <RoomCard key={room.id} room={room} />)
                        )}
                    </div>

                    {/* Phân trang */}
                    <Pagination className="mt-6 mb-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href="#"
                                        isActive={index + 1 === currentPage}
                                        onClick={() => handlePageChange(index + 1)}
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
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
};

export default Search;
