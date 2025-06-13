import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PostDetailsDialog from "@/components/Admin/Posts/PostDetailsDialog";
import { TfiReload } from "react-icons/tfi";
import PostReportDialog from "@/components/Admin/Posts/PostReportDialog";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import axiosClient from "@/apis/axiosClient";
import { useToast } from "@/hooks/use-toast"; // 👈 Thêm dòng này

const Dashboard = () => {
    const { toast } = useToast(); // 👈 Khởi tạo toast

    const [activeTab, setActiveTab] = useState("pending");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(1);

    // Hàm xử lý khi thay đổi tab
    const handleTabChange = (value) => {
        setActiveTab(value);
        setCurrentPage(1); // Reset về trang 1 khi đổi tab
        setSelectedPost(null); // Reset selected post khi đổi tab
    };

    const fetchData = async (tab, page) => {
        setLoading(true);
        try {
            let endpoint = "";
            if (tab === "pending") endpoint = "/post/admin/pending";
            else if (tab === "approved") endpoint = "/post/admin/approved";
            else if (tab === "rejected") endpoint = "/post/admin/rejected";
            else if (tab === "reported") endpoint = "/reports/admin/all";
            else if (tab === "locked") endpoint = "/post/admin/locked";

            const response = await axiosClient.getMany(endpoint, { page: page - 1 });

            if (tab === "reported") setReports(response.data.content);
            else setPosts(response.data.content);

            setTotalPage(response.data.totalPages);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Không thể tải dữ liệu, vui lòng thử lại.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (postId) => {
        try {
            await axiosClient.put(`/post/admin/approve/${postId}`);
            toast({
                title: "Thành công",
                description: "Bài viết đã được duyệt.",
            });
            setSelectedPost(null);
            fetchData(activeTab, currentPage);
        } catch (err) {
            toast({
                title: "Lỗi",
                description: "Không thể duyệt bài viết.",
            });
        }
    };

    const handleReject = async (postId) => {
        try {
            await axiosClient.put(`/post/admin/reject/${postId}`);
            toast({
                title: "Thành công",
                description: "Bài viết đã bị từ chối.",
            });
            setSelectedPost(null);
            fetchData(activeTab, currentPage);
        } catch (err) {
            toast({
                title: "Lỗi",
                description: "Không thể từ chối bài viết.",
            });
        }
    };

    const handleApproveReport = async (postId) => {
        try {
            const response = await axiosClient.put(`/reports/admin/approve/${postId}`, {
                reason: selectedPost?.reason,
            });
            toast({
                title: "Thành công",
                description: response.message || "Đã duyệt báo cáo.",
            });
            setSelectedPost(null);
            fetchData(activeTab, currentPage);
        } catch (err) {
            toast({
                title: "Lỗi",
                description: "Không thể duyệt báo cáo.",
            });
        }
    };

    const handleRejectReport = async (postId) => {
        try {
            const response = await axiosClient.put(`/reports/admin/reject/${postId}`, {
                reason: selectedPost?.reason,
            });
            toast({
                title: "Thành công",
                description: response.data.message || "Đã từ chối báo cáo.",
            });
            setSelectedPost(null);
            fetchData(activeTab, currentPage);
        } catch (err) {
            toast({
                title: "Lỗi",
                description: "Không thể từ chối báo cáo.",
            });
        }
    };

    useEffect(() => {
        fetchData(activeTab, currentPage);
    }, [activeTab, currentPage]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Tabs và Tìm kiếm */}
            <div className="flex items-center justify-between mb-4">
                <Tabs defaultValue="pending" onValueChange={handleTabChange}>
                    <TabsList>
                        <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
                        <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
                        <TabsTrigger value="rejected">Không được duyệt</TabsTrigger>
                        <TabsTrigger value="reported">Bị báo cáo</TabsTrigger>
                        <TabsTrigger value="locked">Bị khóa</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                    <div className="relative w-72">
                        <AiOutlineSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Tìm kiếm..." className="pl-10 w-full border-primary/20" />
                    </div>
                    <Button variant="ghost" onClick={() => fetchData(activeTab, currentPage)}>
                        <TfiReload size={25} className="text-primary" />
                    </Button>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="rounded-lg border bg-white shadow overflow-hidden">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-primary/5 text-black font-bold">
                            {activeTab === "reported" ? (
                                <>
                                    <TableHead className="text-center">ID</TableHead>
                                    <TableHead>Lý do</TableHead>
                                    <TableHead>Chi tiết</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                </>
                            ) : (
                                <>
                                    <TableHead className="text-center">#</TableHead>
                                    <TableHead>Tiêu đề</TableHead>
                                    <TableHead>Mô tả</TableHead>
                                    <TableHead>Tác giả</TableHead>
                                    <TableHead>Lần cập nhật cuối</TableHead>
                                </>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center">Đang tải dữ liệu...</TableCell>
                            </TableRow>
                        ) : activeTab === "reported" ? (
                            reports.map((report) => (
                                <TableRow key={report.reportId} onClick={() => setSelectedPost(report)} className="cursor-pointer hover:bg-gray-100">
                                    <TableCell>{report.reportId}</TableCell>
                                    <TableCell className="truncate max-w-[120px]">{report.reason}</TableCell>
                                    <TableCell className="truncate max-w-[300px]">{report.details}</TableCell>
                                    <TableCell>{report.status}</TableCell>
                                    <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
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

            {/* Dialog */}
            {activeTab === "reported" ? (
                <PostReportDialog
                    postId={selectedPost?.postId}
                    reportId={selectedPost?.reportId}
                    onApprove={() => handleApproveReport(selectedPost?.reportId)}
                    onReject={() => handleRejectReport(selectedPost?.reportId)}
                    onCancel={() => setSelectedPost(null)}
                />
            ) : (
                selectedPost && <PostDetailsDialog
                    postId={selectedPost?.postId}
                    onApprove={() => handleApprove(selectedPost?.postId)}
                    onReject={() => handleReject(selectedPost?.postId)}
                    onCancel={() => setSelectedPost(null)}
                />
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
