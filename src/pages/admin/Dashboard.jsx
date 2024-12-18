import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineReload } from "react-icons/ai";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import PostDetailsDialog from "@/components/Admin/Posts/PostDetailsDialog";
import { TfiReload } from "react-icons/tfi";
import PostReportDialog from "@/components/Admin/Posts/PostReportDialog";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import axiosClient from "@/apis/axiosClient"; // Import API client

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("pending");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(1);

    const fetchData = async (tab) => {
        setLoading(true);
        try {
            let endpoint = "";
            if (tab === "pending") {
                endpoint = "/post/admin/pending";
            } else if (tab === "approved") {
                endpoint = "/post/admin/approved";
            } else if (tab === "rejected") {
                endpoint = "/post/admin/rejected";
            }

            const response = await axiosClient.getMany(endpoint);
            setPosts(response.data.content); // Giả sử API trả về dữ liệu trong `data.content`
            setTotalPage(response.data.totalPages);

        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(activeTab, currentPage); // Lấy dữ liệu khi tab hoặc trang thay đổi
    }, [activeTab, currentPage]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Tabs và Tìm kiếm */}
            <div className="flex items-center justify-between mb-4">
                <Tabs defaultValue="pending" onValueChange={(value) => setActiveTab(value)}>
                    <TabsList>
                        <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
                        <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
                        <TabsTrigger value="rejected">Không được duyệt</TabsTrigger>
                        <TabsTrigger value="reported">Bị báo cáo</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                    <div className="relative w-72">
                        <AiOutlineSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Tìm kiếm..." className="pl-10 w-full border-primary/20" />
                    </div>
                    <Button variant="ghost">
                        <TfiReload size={25} className=" text-primary " />
                    </Button>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="rounded-lg border bg-white shadow overflow-hidden">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-primary/5 text-black font-bold">
                            <TableHead className="text-center">#</TableHead>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Mô tả</TableHead>
                            <TableHead>Tác giả</TableHead>
                            <TableHead>Lần cập nhật cuối</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center">Đang tải dữ liệu...</TableCell>
                            </TableRow>
                        ) : (
                            posts.map((item) => (
                                <TableRow key={item.postId} onClick={() => setSelectedPost(item)} className="cursor-pointer hover:bg-gray-100">
                                    <TableCell>{item.postId}</TableCell>
                                    <TableCell className="truncate max-w-[120px]">{item.title}</TableCell>
                                    <TableCell className="truncate max-w-[300px]">{item.description}</TableCell>
                                    <TableCell>{item.fullName}</TableCell>
                                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Hiển thị dialog dựa trên tab */}
            {activeTab === "reported" ? (
                <PostReportDialog data={selectedPost} onCancel={() => setSelectedPost(null)} />
            ) : (
                selectedPost && <PostDetailsDialog data={selectedPost} onCancel={() => setSelectedPost(null)} />
            )}

            {/* Phân trang */}
            <div className="mt-4 flex justify-end items-center gap-4">
                <PaginationAdmin
                    total={totalPage}
                    page={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};

export default Dashboard;
