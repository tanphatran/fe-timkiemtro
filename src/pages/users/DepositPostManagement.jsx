import React, { useState, useEffect } from "react";
import axiosClient from "@/apis/axiosClient";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DepositPostCard from "@/components/Card/DepositPostCard";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import DepositDetailsDialog from "@/components/Dialog/DepositDetailsDialog";
import DepositedUsersDialog from "@/components/Dialog/DepositedUsersDialog";
import { useToast } from "@/hooks/use-toast";

const DepositPostManagement = () => {
    const [status, setStatus] = useState("my-deposits"); // "my-deposits" or "others-deposits"
    const [activePage, setActivePage] = useState(1);
    const postsPerPage = 4;
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
    const [depositedUsers, setDepositedUsers] = useState([]);
    const { toast } = useToast();

    const fetchPosts = async (status, page = 0) => {
        try {
            const endpoint = status === "my-deposits"
                ? `v1/deposit/posts?page=${page}&size=${postsPerPage}`
                : `v1/deposit/posts-with-deposits?page=${page}&size=${postsPerPage}`;

            const response = await axiosClient.getMany(endpoint);

            if (response.data) {
                setPosts(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            }
        } catch (error) {
            console.error(`Error fetching ${status} posts:`, error);
        }
    };

    useEffect(() => {
        fetchPosts(status, activePage - 1);
    }, [status, activePage]);

    const handleTabChange = (newStatus) => {
        setStatus(newStatus);
        setActivePage(1);
    };

    const handlePostClick = async (post) => {
        if (status === "my-deposits") {
            setSelectedPost(post);
            setIsDetailsDialogOpen(true);
        } else {
            try {
                const response = await axiosClient.getOne(`v1/deposit/post/${post.postId}/users`);
                if (response.data) {
                    setDepositedUsers(response.data);
                    setIsUsersDialogOpen(true);
                }
            } catch (error) {
                console.error("Error fetching deposited users:", error);
                toast({
                    title: "Lỗi",
                    description: "Không thể lấy danh sách người đặt cọc",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Quản lý bài viết đặt cọc</h1>

            <Tabs defaultValue="my-deposits" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger
                        value="my-deposits"
                        onClick={() => handleTabChange("my-deposits")}
                    >
                        Bài viết đã đặt cọc
                    </TabsTrigger>
                    <TabsTrigger
                        value="others-deposits"
                        onClick={() => handleTabChange("others-deposits")}
                    >
                        Bài viết người khác cọc
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={status}>
                    {posts.length > 0 ? (
                        <>
                            {posts.map((post, index) => (
                                <div key={index} onClick={() => handlePostClick(post)}>
                                    <DepositPostCard
                                        post={post}
                                        status={status}
                                        onRefresh={() => fetchPosts(status, activePage - 1)}
                                    />
                                </div>
                            ))}
                            <div className="flex justify-end mt-4">
                                <PaginationAdmin
                                    total={totalPages}
                                    page={activePage}
                                    onChange={setActivePage}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Chưa có bài viết nào
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <DepositDetailsDialog
                open={isDetailsDialogOpen}
                onOpenChange={setIsDetailsDialogOpen}
                post={selectedPost}
            />

            <DepositedUsersDialog
                open={isUsersDialogOpen}
                onOpenChange={setIsUsersDialogOpen}
                depositedUsers={depositedUsers}
            />
        </div>
    );
};

export default DepositPostManagement; 