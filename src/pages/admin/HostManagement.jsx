import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { TfiReload } from "react-icons/tfi";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HostInfoDialog from "@/components/Admin/HostInfoDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import axiosClient from "@/apis/axiosClient"; // Import axiosClient

const HostManagement = () => {
    const [activeTab, setActiveTab] = useState("pending");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedHost, setSelectedHost] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [users, setUsers] = useState({
        pending: [],
        approved: [],
        rejected: [],
    });
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    // Hàm gọi API lấy dữ liệu theo tab
    const fetchData = async (tab) => {
        setLoading(true);
        try {
            let url = "";
            if (tab === "pending") {
                url = "/user/admin/pending-approval";
            } else if (tab === "approved") {
                url = "/user/admin/approved";
            } else if (tab === "rejected") {
                url = "/user/admin/not-registered";
            }

            // Gọi API để lấy dữ liệu
            const response = await axiosClient.getMany(url);

            // Cập nhật dữ liệu vào state
            setUsers((prevState) => ({
                ...prevState,
                [tab]: response.data.content, // Dữ liệu trả về từ API
            }));
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Sử dụng useEffect để fetch data khi thay đổi tab hoặc trang
    useEffect(() => {
        fetchData(activeTab);
    }, [activeTab, currentPage]);

    const handleOpenDialog = (host) => {
        setSelectedHost(host);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedHost(null);
    };

    const handleApprove = async (userId) => {
        try {
            await axiosClient.put(`/user/admin/approve-landlord/${userId}`);
            //     alert("Bài viết đã được duyệt.");
            handleCloseDialog();
            fetchData(activeTab, currentPage);
        } catch (err) {
            console.error("Lỗi khi duyệt bài viết:", err);
            //       alert("Lỗi khi duyệt bài viết.");
        }
    };

    const handleReject = async (userId) => {
        try {
            await axiosClient.put(`/user/admin/reject-landlord/${userId}`);
            alert("Bài viết đã bị từ chối.");
            handleCloseDialog();
            fetchData(activeTab, currentPage);
        } catch (err) {
            console.error("Lỗi khi từ chối bài viết:", err);
            alert("Lỗi khi từ chối bài viết.");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Tabs */}
            <div className="flex justify-between items-center mb-4">
                <Tabs defaultValue="pending" onValueChange={(value) => setActiveTab(value)}>
                    <TabsList>
                        <TabsTrigger value="pending" className={activeTab === "pending" ? "text-primary" : ""}>
                            Hồ sơ chờ duyệt
                        </TabsTrigger>
                        <TabsTrigger value="approved" className={activeTab === "approved" ? "text-primary" : ""}>
                            Hồ sơ đã duyệt
                        </TabsTrigger>
                        <TabsTrigger value="rejected" className={activeTab === "rejected" ? "text-primary" : ""}>
                            Hồ sơ bị từ chối
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Thanh tìm kiếm */}
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <AiOutlineSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Tìm kiếm..." className="pl-10 w-full border-gray-300" />
                    </div>
                    <Button variant="ghost">
                        <TfiReload size={25} className="text-gray-500" />
                    </Button>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="rounded-lg border bg-white shadow-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-primary/5 text-black font-bold">
                            <TableHead>#</TableHead>
                            <TableHead>Họ & Tên</TableHead>
                            <TableHead>Ngày sinh</TableHead>
                            <TableHead>Địa chỉ thường trú</TableHead>
                            <TableHead>Ngày đăng ký</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : users[activeTab].length > 0 ? (
                            users[activeTab].map((item) => (
                                <TableRow
                                    key={item.userId}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleOpenDialog(item)}
                                >
                                    <TableCell>{item.userId}</TableCell>
                                    <TableCell>{item.fullName}</TableCell>
                                    <TableCell>{item.dateOfBirth}</TableCell>
                                    <TableCell>{item.address}</TableCell>
                                    <TableCell>{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Phân trang */}
            <div className="mt-4 flex justify-end">
                <PaginationAdmin
                    total={totalPages}
                    page={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>

            {/* Dialog */}
            {selectedHost && (
                <HostInfoDialog
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    hostId={selectedHost.userId}
                    onApprove={() => handleApprove(selectedHost.userId)}
                    onReject={() => handleReject(selectedHost.userId)}
                />
            )}
        </div>
    );
};

export default HostManagement;
