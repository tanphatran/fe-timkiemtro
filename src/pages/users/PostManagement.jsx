import React, { useState, useEffect } from "react";
import axiosClient from "@/apis/axiosClient";  // Đảm bảo import axiosClient từ đúng vị trí
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostCard from "@/components/Card/PostCard";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import EditPostDialog from "./EditPostDialog";

const PostManagement = () => {
    const [status, setStatus] = useState("approved");  // Mặc định là "approved"
    const [activePage, setActivePage] = useState(1);
    const postsPerPage = 4;
    const [editingPost, setEditingPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postCounts, setPostCounts] = useState({
        approved: 0,
        pending: 0,
        rejected: 0,
        anonymous: 0,
    });

    const handleSaveSuccess = () => {
        setEditingPost(null);  // Đóng dialog sau khi lưu thành công
        fetchPosts(status);
    };

    const handleEditPost = (post) => {
        console.log("Post to edit:", post); // Thêm log kiểm tra
        setEditingPost(post);

    };


    // Hàm gọi API để lấy bài viết theo trạng thái
    const fetchPosts = async (status) => {
        try {
            const response = await axiosClient.getMany(`/post/${status}`);  // Gọi API từ axiosClient
            console.log('API Response:', response.data);  // Kiểm tra dữ liệu trả về

            if (response.data) {
                setPosts(response.data.content);
                console.log('API Response:', response.data.content); // Cập nhật bài viết từ dữ liệu trả về
            }
        } catch (error) {
            console.error(`Error fetching ${status} posts:`, error);
        }
    };
    const fetchPostsAndCounts = async () => {
        try {
            // Gọi API cho từng trạng thái và lấy số lượng bài viết
            const statuses = ["approved", "pending", "rejected", "anonymous"];
            const counts = {};

            for (let status of statuses) {
                const response = await axiosClient.getMany(`/post/${status}`);
                if (response.data) {
                    counts[status] = response.data.totalElements;
                }
            }

            setPostCounts(counts);
            fetchPosts(status);
        } catch (error) {
            console.error("Error fetching posts counts:", error);
        }
    };
    useEffect(() => {
        fetchPostsAndCounts();
    }, []);
    useEffect(() => {
    }, [posts]);

    // Gọi API khi trạng thái tab thay đổi
    useEffect(() => {
        fetchPosts(status);
    }, [status]);

    // Tính tổng số trang (dùng posts trực tiếp)
    const totalPages = Math.ceil(posts.length / postsPerPage);

    // Lấy danh sách bài viết trên trang hiện tại (dùng posts trực tiếp)
    const currentPosts = posts.slice(
        (activePage - 1) * postsPerPage,
        activePage * postsPerPage
    );

    const handleTabChange = (newStatus) => {
        setStatus(newStatus);  // Cập nhật trạng thái tab
        setActivePage(1);  // Đặt lại trang về 1
    };

    return (
        <Tabs defaultValue="approved" className="w-full">
            <TabsList className="mb-4">
                <TabsTrigger value="approved" onClick={() => handleTabChange("approved")}>
                    Đang hiển thị ({postCounts.approved})
                </TabsTrigger>
                <TabsTrigger value="pending" onClick={() => handleTabChange("pending")}>
                    Đang chờ duyệt ({postCounts.pending})
                </TabsTrigger>
                <TabsTrigger value="rejected" onClick={() => handleTabChange("rejected")}>
                    Bị từ chối ({postCounts.rejected})
                </TabsTrigger>
                <TabsTrigger value="anonymous" onClick={() => handleTabChange("anonymous")}>
                    Bị ẩn ({postCounts.anonymous})
                </TabsTrigger>

            </TabsList>

            <TabsContent value={status}>
                {currentPosts.length > 0 ? (
                    <>
                        {currentPosts.map((post, index) => (
                            <PostCard key={index} post={post} onEdit={handleEditPost} status={status} onRefresh={fetchPostsAndCounts} />
                        ))}
                        <div className="flex justify-end mt-4">
                            <PaginationAdmin total={totalPages} page={activePage} onChange={setActivePage} />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Chưa có bài viết nào
                    </div>
                )}
            </TabsContent>

            {editingPost && (
                <EditPostDialog
                    postId={editingPost?.postUuid}
                    onSaveSuccess={handleSaveSuccess}
                />
            )}
        </Tabs>
    );
};

export default PostManagement;
