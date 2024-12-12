import React, { useState, useEffect } from "react";
import axiosClient from "@/apis/axiosClient";  // Import axios client đã có interceptor
import FavoriteCard from "@/components/Card/FavoriteCard";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";

const FavoritePosts = () => {
    const [activePage, setActivePage] = useState(1); // Trang hiện tại
    const [favoritePosts, setFavoritePosts] = useState([]); // Dữ liệu bài viết yêu thích
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const postsPerPage = 4; // Số bài viết trên mỗi trang

    // Gọi API khi component được render
    useEffect(() => {
        const fetchFavoritePosts = async () => {
            try {
                const response = await axiosClient.getOne("/post/favorites");
                if (response?.status === "success" && response?.data?.content) {
                    setFavoritePosts(response.data.content); // Truy cập chính xác
                } else {
                    console.error("Không tìm thấy bài viết yêu thích trong response:", response);
                }

            } catch (error) {
                console.error("Lỗi khi gọi API:", error.message);
            } finally {
                setLoading(false);
            }
        };




        fetchFavoritePosts();
    }, []);  // Chỉ gọi 1 lần khi component mount

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

            {/* Hiển thị khi đang tải */}
            {loading ? (
                <p className="text-gray-500">Đang tải bài viết yêu thích...</p>
            ) : (
                // Danh sách bài viết yêu thích
                currentPosts.length > 0 ? (
                    currentPosts.map((post, index) => (
                        <FavoriteCard key={post.postUuid} post={post} className="mb-4" />
                    ))
                ) : (
                    <p className="text-gray-500">Không có bài viết yêu thích nào.</p>
                )
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
