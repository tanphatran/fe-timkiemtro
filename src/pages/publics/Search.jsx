import React, { useState } from "react";
import RoomCard from "@/components/Rooms/RoomCard";
import SearchFilter from "@/components/Searchs/SearchFilter";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import Room1 from "@/assets/room1.jpg";
import Room2 from "@/assets/room2.jpg";
import Room3 from "@/assets/room3.jpg";
import Room4 from "@/assets/room4.jpg";
import Room5 from "@/assets/room5.jpg";
import Room6 from "@/assets/room6.jpg";

const Search = () => {
    const [sortOption, setSortOption] = useState("default"); // Lựa chọn sắp xếp

    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 9; // Số phòng hiển thị mỗi trang
    const [rooms] = useState([
        { featuredImage: Room1, name: "CHO THUÊ NHÀ ĐƯỜNG NGUYỄN ĐÌNH QUÂN P5 ĐÀ LẠT", price: 2000000, electricityPrice: 2500, waterPrice: 25000, size: 50, time: "Today" },
        { featuredImage: Room4, name: "cho thuê nhà nguyên căn 2", price: 3000000, electricityPrice: 2000, waterPrice: 22000, size: 70, time: "2 days ago" },
        { featuredImage: Room1, name: "cho thuê nhà nguyên căn 2 mặt tiền đường chính", price: 5000000, electricityPrice: 3500, waterPrice: 30000, size: 120, time: "Today" },
        { featuredImage: Room5, name: "Room E", price: 800000, electricityPrice: 2500, waterPrice: 18000, size: 20, time: "Last week" },
        { featuredImage: Room6, name: "cho thuê nhà nguyên căn ĐƯỜNG NGUYỄN ĐÌNH QUÂN P5 ĐÀ LẠT", price: 1500000, electricityPrice: 3000, waterPrice: 20000, size: 30, time: "Yesterday" },
        { featuredImage: Room3, name: "Room C", price: 3000000, electricityPrice: 2000, waterPrice: 22000, size: 70, time: "2 days ago" },
        { featuredImage: Room4, name: "cho thuê nhà nguyên căn 2 mặt tiền đường chính", price: 5000000, electricityPrice: 3500, waterPrice: 30000, size: 120, time: "Today" },
        { featuredImage: Room2, name: "Room E", price: 800000, electricityPrice: 2500, waterPrice: 18000, size: 20, time: "Last week" },
        { featuredImage: Room4, name: "cho thuê nhà nguyên căn 2", price: 3000000, electricityPrice: 2000, waterPrice: 22000, size: 70, time: "2 days ago" },
        { featuredImage: Room3, name: "cho thuê nhà nguyên căn 2 mặt tiền đường chính", price: 5000000, electricityPrice: 3500, waterPrice: 30000, size: 120, time: "Today" },
        { featuredImage: Room5, name: "Room E", price: 800000, electricityPrice: 2500, waterPrice: 18000, size: 20, time: "Last week" },
        { featuredImage: Room6, name: "cho thuê nhà nguyên căn ĐƯỜNG NGUYỄN ĐÌNH QUÂN P5 ĐÀ LẠT", price: 1500000, electricityPrice: 3000, waterPrice: 20000, size: 30, time: "Yesterday" },
        { featuredImage: Room3, name: "Room C", price: 3000000, electricityPrice: 2000, waterPrice: 22000, size: 70, time: "2 days ago" },
        { featuredImage: Room3, name: "ĐƯỜNG NGUYỄN ĐÌNH QUÂN P5 ĐÀ LẠT", price: 4500000, electricityPrice: 3000, waterPrice: 28000, size: 150, time: "Yesterday" },
    ]);

    // Hàm sắp xếp
    const sortRooms = (option) => {
        let sortedRooms = [...rooms];
        if (option === "price") {
            sortedRooms.sort((a, b) => a.price - b.price); // Sắp xếp giá tăng dần
        } else if (option === "size") {
            sortedRooms.sort((a, b) => a.size - b.size); // Sắp xếp diện tích tăng dần
        } else if (option === "time") {
            // Custom sort logic for time (e.g., based on custom criteria)
        }
        setRooms(sortedRooms);
    };

    // Xử lý khi thay đổi lựa chọn sắp xếp
    const handleSortChange = (event) => {
        const option = event.target.value;
        setSortOption(option);
        sortRooms(option);
    };
    const totalPages = Math.ceil(rooms.length / itemsPerPage);

    // Lấy dữ liệu cho trang hiện tại
    const currentRooms = rooms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                    <div className=" mb-4 flex justify-normal items-center">
                        <span className="text-base font-semibold text-gray-700 ml-2">Sắp xếp theo: </span>
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="border border-gray-300 rounded-md p-1 text-gray-700  focus:outline-primary focus:border-primary"
                        >
                            <option value="default">Mặc định</option>
                            <option value="price">Giá (Thấp đến Cao)</option>
                            <option value="size">Kích thước (Nhỏ đến Lớn)</option>
                            <option value="time">Mới nhất</option>
                        </select>
                    </div>


                    {/* Danh sách phòng */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                        {currentRooms.map((room, index) => (
                            <RoomCard key={index} room={room} />
                        ))}
                    </div>

                    {/* Phân trang */}
                    <Pagination className="mt-6 mb-4 ">
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
