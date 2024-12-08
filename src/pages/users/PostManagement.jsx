import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostCard from "@/components/Card/PostCard";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import EditPostDialog from "./EditPostDialog";

const PostManagement = () => {
    const [status, setStatus] = useState("active"); // Trạng thái tab hiện tại
    const [activePage, setActivePage] = useState(1); // Trang hiện tại
    const postsPerPage = 2; // Số bài viết trên mỗi trang
    const [editingPost, setEditingPost] = useState(null);
    const handleSaveSuccess = () => {
        setEditingPost(null); // Đóng dialog sau khi lưu thành công
    };
    const handleEditPost = (post) => {
        setEditingPost(post); // Gán bài viết được chọn
    };



    // Dữ liệu mẫu cho các bài viết
    const posts = [
        {
            id: "86477e7f-8eea-4a2d-85d3-dbdfc8908bce",
            featuredImage: "https://cloud.mogi.vn/images/2023/10/05/468/39883dc1f48440c1a8f76a320af4b7ac.jpg",
            title: "Cho thuê nhà nguyên căn Quận Thủ Đức gần ĐH Ngân Hàng",
            price: "1.200.000đ",
            area: "12,12",
            location: "206/3 Hoàng Diệu 2, Linh Chiểu, Thủ Đức, TP.HCM",
            status: "active", // Trạng thái bài viết
            waterPrice: "15000",
            electricityPrice: "4000",
        },
        {
            featuredImage: "https://cloud.mogi.vn/images/2024/11/26/539/4b264f3ba62a4ffe820b0bf542429cc4.jpg",
            title: "Cho thuê nhà nguyên căn Quận 1",
            price: "1.200.000đ",
            area: "12,12",
            location: "206/3 Hoàng Diệu 2, Linh Chiểu, Thủ Đức, TP.HCM",
            status: "active", // Trạng thái bài viết
            waterPrice: "15000",
            electricityPrice: "4000",
        },
        {
            featuredImage: "https://cloud.mogi.vn/images/2023/10/05/467/24a0aa2aa413438e9860dd822372cfa9.jpg",
            title: "xxx",
            price: "3.200.000đ",
            area: "32",
            location: "206/3 Hoàng Diệu 2, Linh Chiểu, Thủ Đức, TP.HCM",
            status: "pending",
            waterPrice: "15000",
            electricityPrice: "4000",
        },
        {
            featuredImage: "https://cloud.mogi.vn/images/2024/03/13/244/74cdce0df05c44fd8cdc5973e04dbd0e.jpg",
            title: "aaa",
            price: "1.800.000đ",
            area: "20",
            location: "206/3 Hoàng Diệu 2, Linh Chiểu, Thủ Đức, TP.HCM",
            status: "report",
            waterPrice: "15000",
            electricityPrice: "4000",
        },
    ];

    // Lọc bài viết theo trạng thái hiện tại
    const filteredPosts = posts.filter((post) => post.status === status);

    // Tính tổng số trang
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    // Lấy danh sách bài viết trên trang hiện tại
    const currentPosts = filteredPosts.slice(
        (activePage - 1) * postsPerPage,
        activePage * postsPerPage
    );

    // Hàm xử lý khi đổi tab
    const handleTabChange = (newStatus) => {
        setStatus(newStatus); // Cập nhật trạng thái
        setActivePage(1); // Đặt lại trang hiện tại về 1
    };

    return (
        <Tabs defaultValue="active" className="w-full">
            {/* Tabs List */}
            <TabsList className="mb-4">
                <TabsTrigger
                    value="active"
                    onClick={() => handleTabChange("active")}
                >
                    Đang hiển thị ({posts.filter((post) => post.status === "active").length})
                </TabsTrigger>
                <TabsTrigger
                    value="pending"
                    onClick={() => handleTabChange("pending")}
                >
                    Đang chờ duyệt ({posts.filter((post) => post.status === "pending").length})
                </TabsTrigger>
                <TabsTrigger
                    value="report"
                    onClick={() => handleTabChange("report")}
                >
                    Bị báo cáo ({posts.filter((post) => post.status === "report").length})
                </TabsTrigger>
            </TabsList>

            {/* Nội dung Tabs */}
            <TabsContent value={status}>
                {currentPosts.map((post, index) => (
                    <PostCard key={index} post={post} onEdit={handleEditPost} />
                ))}

                {/* Phân trang */}
                <div className="flex justify-end mt-4">
                    <PaginationAdmin
                        total={totalPages}
                        page={activePage}
                        onChange={setActivePage}
                    />
                </div>
            </TabsContent>
            {editingPost && (
                <EditPostDialog
                    postId={editingPost?.id} // Đảm bảo editingPost có giá trị
                    userUuid="1271badd-96a9-11ef-8230-088fc3773299"
                    onSaveSuccess={handleSaveSuccess}
                />
            )}



        </Tabs>
    );
};

export default PostManagement;
