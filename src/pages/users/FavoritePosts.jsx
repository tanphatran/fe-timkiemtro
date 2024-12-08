import React, { useState } from "react";
import PostCard from "@/components/Card/PostCard";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import FavoriteCard from "@/components/Card/FavoriteCard";

const FavoritePosts = () => {
    const [activePage, setActivePage] = useState(1); // Trang hiện tại
    const postsPerPage = 4; // Số bài viết trên mỗi trang

    // Dữ liệu mẫu cho các bài viết yêu thích
    const favoritePosts = [
        {
            featuredImage: "https://cloud.mogi.vn/images/2023/10/05/468/39883dc1f48440c1a8f76a320af4b7ac.jpg",
            title: "Cho thuê nhà nguyên căn Quận Thủ Đức gần ĐH Ngân Hàng",
            price: "1.200.000đ",
            area: "12,12",
            location: "206/3 Hoàng Diệu 2, Linh Chiểu, Thủ Đức, TP.HCM",
            waterPrice: "15000",
            electricityPrice: "4000",
        },
        {
            featuredImage: "https://cloud.mogi.vn/images/2024/11/26/539/4b264f3ba62a4ffe820b0bf542429cc4.jpg",
            title: "Cho thuê nhà nguyên căn Quận 1",
            price: "1.200.000đ",
            area: "12,12",
            location: "206/3 Hoàng Diệu 2, Linh Chiểu, Thủ Đức, TP.HCM",
            waterPrice: "15000",
            electricityPrice: "4000",
        },
        {
            featuredImage: "https://cloud.mogi.vn/images/2023/10/05/467/24a0aa2aa413438e9860dd822372cfa9.jpg",
            title: "Căn hộ cao cấp Quận 7",
            price: "3.500.000đ",
            area: "40",
            location: "Nguyễn Văn Linh, Quận 7, TP.HCM",
            waterPrice: "20000",
            electricityPrice: "5000",
        },
        {
            featuredImage: "https://cloud.mogi.vn/images/2023/10/05/467/24a0aa2aa413438e9860dd822372cfa9.jpg",
            title: "Căn hộ cao cấp Quận 7",
            price: "3.500.000đ",
            area: "40",
            location: "Nguyễn Văn Linh, Quận 7, TP.HCM",
            waterPrice: "20000",
            electricityPrice: "5000",
        },
    ];

    // Tính tổng số trang
    const totalPages = Math.ceil(favoritePosts.length / postsPerPage);

    // Lấy danh sách bài viết trên trang hiện tại
    const currentPosts = favoritePosts.slice(
        (activePage - 1) * postsPerPage,
        activePage * postsPerPage
    );

    return (
        <div className="w-full">
            <h1 className="text-xl font-bold mb-4">Bài viết yêu thích</h1>

            {/* Danh sách bài viết */}
            {currentPosts.length > 0 ? (
                currentPosts.map((post, index) => (
                    <FavoriteCard key={index} post={post} className="mb-4" />
                ))
            ) : (
                <p className="text-gray-500">Không có bài viết yêu thích nào.</p>
            )}

            {/* Phân trang */}

            <div className="flex justify-end mt-4">
                <PaginationAdmin
                    total={totalPages}
                    page={activePage}
                    onChange={setActivePage}
                />
            </div>

        </div>
    );
};

export default FavoritePosts;
