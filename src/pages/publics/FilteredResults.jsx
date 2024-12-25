import React, { useState, useEffect } from "react";
import RoomCard from "@/components/Rooms/RoomCard";
import axiosClient from "@/apis/axiosClient";
import { useLocation } from "react-router-dom";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import SearchFilter from "@/components/Searchs/SearchFilter";

const FilteredResults = () => {
    const [rooms, setRooms] = useState([]); // Dữ liệu phòng
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const location = useLocation();

    // Lấy tham số từ URL
    useEffect(() => {
        // Lấy các tham số lọc từ URL
        const getFilterParams = () => {
            const queryParams = new URLSearchParams(location.search); // Thay thế window.location.search
            const minPrice = queryParams.get("minPrice");
            const maxPrice = queryParams.get("maxPrice");
            const city = queryParams.get("city");
            const district = queryParams.get("district");
            const ward = queryParams.get("ward");
            const keyword = queryParams.get("keyword");
            const minArea = queryParams.get("minArea");
            const maxArea = queryParams.get("maxArea");
            console.log(minArea);

            return { minPrice, maxPrice, city, district, ward, keyword, minArea, maxArea };
        };

        const fetchFilteredRooms = async (page) => {
            setLoading(true);
            try {
                const { minPrice, maxPrice, city, district, ward, keyword, minArea, maxArea } = getFilterParams();

                const queryParams = {
                    page: page - 1,
                    size: 9,
                    minPrice,
                    maxPrice,
                    city,
                    district,
                    ward,
                    keyword,
                    minArea,
                    maxArea,
                };

                const filteredParams = Object.entries(queryParams)
                    .filter(([, value]) => value)
                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    .join("&");

                const response = await axiosClient.getOne(`/post/filter?${filteredParams}`);

                const formattedRooms = response.data.content.map((room) => ({
                    id: room.postUuid,
                    featuredImage: room.postImages?.[0] || "",
                    name: room.title,
                    price: room.price,
                    electricityPrice: room.electricityPrice,
                    waterPrice: room.waterPrice,
                    size: room.area,
                    time: new Date(room.createdAt).toLocaleDateString("vi-VN"),
                    houseNumber: room.houseNumber || "",
                    street: room.street || "",
                    ward: room.ward || "",
                    district: room.district || "",
                    city: room.city || "",
                }));

                setRooms(formattedRooms);
                setTotalPages(Math.ceil(response.data.totalElements / 9));
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu phòng:", error.message);
                setRooms([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredRooms(currentPage);
    }, [location.search, currentPage]);  // Gọi lại khi tham số URL thay đổi


    // Xử lý thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="mt-14 px-4 sm:px-8 md:px-16 lg:px-28">
            <SearchFilter />

            <div className="w-full">
                <div className="w-full max-w-screen-xl mx-auto">

                    {/* Danh sách phòng */}
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

export default FilteredResults;
