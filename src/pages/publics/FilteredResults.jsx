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
import { Button } from "@/components/ui/button";
import NotificationDialog from "@/components/Notification/NotificationDialog";
import SearchInfoDialog from "@/components/Notification/SearchInfoDialog ";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const FilteredResults = () => {
    const [rooms, setRooms] = useState([]); // Dữ liệu phòng
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const location = useLocation();
    const [noResults, setNoResults] = useState(false); // Thêm state kiểm tra kết quả
    const [openDialog, setOpenDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const { isLoggedIn } = useAuth();
    const { toast } = useToast();
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

            return { minPrice, maxPrice, city, district, ward, keyword, minArea, maxArea };
        };

        const fetchFilteredRooms = async (page) => {
            setLoading(true);
            setNoResults(false); // Reset lại khi bắt đầu fetch
            setRooms([]); // Xóa danh sách cũ

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
                console.log("API Response:", response.data); // Debug dữ liệu trả về

                if (!response.data || response.data.status === "error" || !response.data.content || response.data.content.length === 0) {
                    console.warn("Không tìm thấy phòng phù hợp.");
                    setNoResults(true);
                    return;
                }

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
                setNoResults(false);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu phòng:", error);
                setNoResults(true);

                if (error.response?.status === 400 || error.response?.status === "error") {
                    console.warn("Không tìm thấy phòng phù hợp. (Lỗi 400)");
                    setNoResults(true);
                } else {
                    console.error("Lỗi khác:", error.message);
                }
            } finally {
                setLoading(false);
            }
        };



        fetchFilteredRooms(currentPage);
    }, [location.search, currentPage]);  // Gọi lại khi tham số URL thay đổi

    const handleOpenDialog = async () => {
        if (!isLoggedIn) {
            toast({
                description: "Vui lòng đăng nhập để đăng ký nhận thông báo!",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await axiosClient.get("/search-information/has-search-information");
            if (response.data === false) {
                // Nếu chưa có thông tin tìm kiếm, mở dialog tạo mới
                setOpenDialog(true);
            } else {
                // Nếu đã có thông tin tìm kiếm, mở dialog cập nhật
                setOpenUpdateDialog(true);
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra thông tin tìm kiếm:", error);
            toast({
                description: "Có lỗi xảy ra, vui lòng thử lại!",
                variant: "destructive",
            });
        }
    };


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
                    <div className="w-full flex justify-center items-center mt-4">
                        {loading ? (
                            <p className="text-center w-full">Đang tải dữ liệu...</p>
                        ) : noResults ? (
                            <div className="flex flex-col items-center text-center w-full max-w-md">
                                <p className="text-lg font-semibold text-gray-600">
                                    Không tìm thấy phòng phù hợp.
                                </p>
                                <Button onClick={handleOpenDialog} className="bg-primary text-white mt-2">
                                    Đăng ký tìm phòng
                                </Button>
                                <NotificationDialog open={openDialog} onOpenChange={setOpenDialog} />
                                <SearchInfoDialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog} />
                            </div>
                        ) : (
                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {rooms.map((room) => <RoomCard key={room.id} room={room} />)}
                            </div>
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
