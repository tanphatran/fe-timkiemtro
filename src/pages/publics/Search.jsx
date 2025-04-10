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
    const [noResults, setNoResults] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

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
            setNoResults(content.length === 0);

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
        <div className="mt-14 px-4 sm:px-8 md:px-16 lg:px-28">
            <SearchFilter />
            <div className="w-full">
                <div className="w-full max-w-screen-xl mx-auto">
                    {/* Thanh sắp xếp */}
                    <div className="mb-4 flex justify-start items-center">
                        <span className="text-base font-semibold text-gray-700 ml-2">Sắp xếp theo: </span>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-primary focus:border-primary w-full sm:w-auto"
                        >
                            <option value="default">Mặc định</option>
                            <option value="price">Giá (Thấp đến Cao)</option>
                            <option value="size">Kích thước (Nhỏ đến Lớn)</option>
                            <option value="time">Mới nhất</option>
                        </select>
                    </div>

                    {/* Danh sách phòng */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {loading ? (
                            <p className="text-center w-full">Đang tải dữ liệu...</p>
                        ) : noResults ? (
                            <div className="text-center w-full">
                                <p className="text-lg font-semibold text-gray-600">
                                    Không tìm thấy phòng phù hợp.
                                </p>
                                <Button className="mt-4 bg-primary text-white" onClick={() => setOpenDialog(true)}>
                                    Đăng ký nhận thông báo khi có phòng
                                </Button>
                                <NotificationDialog open={openDialog} onOpenChange={setOpenDialog} />
                            </div>
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

export default Search;
