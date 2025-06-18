import React, { useState, useEffect } from "react";
import axiosClient from "@/apis/axiosClient"; // Axios client đã cấu hình
import AddUserDialog from "@/components/Admin/AddUserDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import { AiOutlineSearch } from "react-icons/ai";
import { TfiReload } from "react-icons/tfi";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState("active");
    const [users, setUsers] = useState({
        active: [],
        rejected: []
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPage, setTotalPage] = useState(1);
    const { toast } = useToast();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);

    // Lấy dữ liệu người dùng từ API
    const fetchUsers = async (tab, page) => {
        setLoading(true);
        try {
            let url = '/user/admin/all-users';
            if (tab === 'rejected') {
                url = '/user/admin/locked-users';
            }

            const response = await axiosClient.getMany(url, {
                page: page - 1,
            });

            setUsers(prev => ({
                ...prev,
                [tab]: response.data.content
            }));
            setTotalPage(response.data.totalPages);
            setError(null);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Không thể tải danh sách người dùng.");
        } finally {
            setLoading(false);
        }
    };

    // Gọi fetchUsers khi component mount và khi currentPage hoặc activeTab thay đổi
    useEffect(() => {
        fetchUsers(activeTab, currentPage);
    }, [currentPage, activeTab]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAddUser = (newUser) => {
        setUsers(prev => ({
            ...prev,
            active: [...prev.active, { id: Date.now(), ...newUser }]
        }));
    };

    const handleBlockClick = (user) => {
        setSelectedUser(user);
        setIsConfirmDialogOpen(true);
    };

    const handleUnlockClick = (user) => {
        setSelectedUser(user);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmBlock = async () => {
        if (!selectedUser) return;

        setIsBlocking(true);
        try {
            await axiosClient.put(`/user/admin/lock-account/${selectedUser.userId}`);
            toast({
                title: "Khóa tài khoản thành công",
                description: "Tài khoản đã bị khóa.",
                variant: "default",
            });
            fetchUsers(activeTab, currentPage);
        } catch (err) {
            console.error("Lỗi khi khóa tài khoản:", err);
            toast({
                title: "Khóa tài khoản thất bại",
                description: "Đã xảy ra lỗi khi khóa tài khoản.",
                variant: "destructive",
            });
        } finally {
            setIsBlocking(false);
            setIsConfirmDialogOpen(false);
            setSelectedUser(null);
        }
    };

    const handleConfirmUnlock = async () => {
        if (!selectedUser) return;

        setIsUnlocking(true);
        try {
            await axiosClient.put(`/user/admin/unlock-account/${selectedUser.userId}`);
            toast({
                title: "Mở khóa tài khoản thành công",
                description: "Tài khoản đã được mở khóa.",
                variant: "default",
            });
            fetchUsers(activeTab, currentPage);
        } catch (err) {
            console.error("Lỗi khi mở khóa tài khoản:", err);
            toast({
                title: "Mở khóa tài khoản thất bại",
                description: "Đã xảy ra lỗi khi mở khóa tài khoản.",
                variant: "destructive",
            });
        } finally {
            setIsUnlocking(false);
            setIsConfirmDialogOpen(false);
            setSelectedUser(null);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold">Quản lý người dùng</h1>
                    <Tabs defaultValue="active" onValueChange={(value) => setActiveTab(value)}>
                        <TabsList>
                            <TabsTrigger value="active" className={activeTab === "active" ? "text-primary" : ""}>
                                Tài khoản hoạt động
                            </TabsTrigger>
                            <TabsTrigger value="rejected" className={activeTab === "rejected" ? "text-primary" : ""}>
                                Tài khoản bị khóa
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <AiOutlineSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm..."
                            className="pl-10 w-full border-gray-300"
                        />
                    </div>

                    <Button variant="ghost">
                        <TfiReload size={25} className="text-gray-500" />
                    </Button>

                    {activeTab === "active" && (
                        <Button
                            variant="default"
                            className="bg-primary text-white"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            + Thêm người dùng
                        </Button>
                    )}
                </div>
            </div>

            {/* Hiển thị khi dữ liệu đang tải */}
            {loading && (
                <div className="text-center py-4 text-gray-500">Đang tải dữ liệu...</div>
            )}

            {/* Hiển thị khi có lỗi */}
            {error && (
                <div className="text-center py-4 text-red-500">{error}</div>
            )}

            {/* Table */}
            <div className="rounded-lg border bg-white shadow-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-primary/5 text-black font-bold">
                            <TableHead>#</TableHead>
                            <TableHead>Họ & Tên</TableHead>
                            <TableHead>Ngày sinh</TableHead>
                            <TableHead>Địa chỉ thường trú</TableHead>
                            <TableHead>Ngày đăng ký</TableHead>
                            {(activeTab === "active" || activeTab === "rejected") && <TableHead>Thao tác</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users[activeTab].length > 0 ? (
                            users[activeTab].map((user) => (
                                <TableRow key={user.userId}>
                                    <TableCell>{user.userId}</TableCell>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.dateOfBirth}</TableCell>
                                    <TableCell>{user.address}</TableCell>
                                    <TableCell>{new Date(user.updatedAt).toLocaleString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })}</TableCell>
                                    {activeTab === "active" && (
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleBlockClick(user)}
                                                className="text-red-600 border-red-600"
                                                disabled={isBlocking}
                                            >
                                                {isBlocking && selectedUser?.userId === user.userId ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                        Đang xử lý...
                                                    </div>
                                                ) : (
                                                    "BLOCK"
                                                )}
                                            </Button>
                                        </TableCell>
                                    )}
                                    {activeTab === "rejected" && (
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleUnlockClick(user)}
                                                className="text-green-600 border-green-600"
                                                disabled={isUnlocking}
                                            >
                                                {isUnlocking && selectedUser?.userId === user.userId ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                                        Đang xử lý...
                                                    </div>
                                                ) : (
                                                    "UNLOCK"
                                                )}
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={activeTab === "active" || activeTab === "rejected" ? 6 : 5} className="text-center">
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <AddUserDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onAddUser={handleAddUser}
            />

            <ConfirmDialog
                open={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}
                title={activeTab === "active" ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa tài khoản"}
                description={activeTab === "active"
                    ? `Bạn có chắc chắn muốn khóa tài khoản của ${selectedUser?.fullName}?`
                    : `Bạn có chắc chắn muốn mở khóa tài khoản của ${selectedUser?.fullName}?`
                }
                confirmText={activeTab === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                cancelText="Hủy"
                onConfirm={activeTab === "active" ? handleConfirmBlock : handleConfirmUnlock}
                onCancel={() => {
                    setIsConfirmDialogOpen(false);
                    setSelectedUser(null);
                }}
                confirmButtonClassName={activeTab === "active"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }
                isLoading={isBlocking || isUnlocking}
            />

            <div className="mt-4 flex justify-center">
                <PaginationAdmin
                    total={totalPage}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default UserManagement;
