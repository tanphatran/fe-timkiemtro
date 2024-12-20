import React, { useState, useEffect } from "react";
import axiosClient from "@/apis/axiosClient"; // Axios client đã cấu hình
import AddUserDialog from "@/components/Admin/AddUserDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import { AiOutlineSearch } from "react-icons/ai";
import { TfiReload } from "react-icons/tfi";
import { Input } from "@/components/ui/input";

const UserManagement = () => {
    const [users, setUsers] = useState([]);  // Để lưu trữ người dùng từ API
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const itemsPerPage = 8; // Số người dùng hiển thị trên mỗi trang
    const [totalPage, setTotalPage] = useState(1);

    // Lấy dữ liệu người dùng từ API
    const fetchUsers = async (page) => {
        setLoading(true);
        try {
            const response = await axiosClient.getMany('/user/admin/all-users', {
                page: page - 1,
            });
            console.log("API Response:", response.data); // Xem dữ liệu trả về
            setUsers(response.data.content);  // Lưu dữ liệu người dùng vào state
            setTotalPage(response.data.totalPages);
            setError(null);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Không thể tải danh sách người dùng.");
        } finally {
            setLoading(false);
        }
    };

    // Gọi fetchUsers khi component mount và khi currentPage thay đổi
    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAddUser = (newUser) => {
        setUsers((prev) => [...prev, { id: Date.now(), ...newUser }]);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Quản lý người dùng</h1>
                <div className="flex items-center gap-2">
                    {/* Search Bar */}
                    <div className="relative w-64">
                        <AiOutlineSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm..."
                            className="pl-10 w-full border-gray-300"
                        />
                    </div>

                    {/* Reload Button */}
                    <Button variant="ghost">
                        <TfiReload size={25} className="text-gray-500" />
                    </Button>

                    <Button
                        variant="default"
                        className="bg-primary text-white"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        + Thêm người dùng
                    </Button>
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
                            <TableHead>Ngày sinh</TableHead>
                            <TableHead>Địa chỉ thường trú</TableHead>
                            <TableHead>Ngày đăng ký</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <TableRow key={user.userId}>
                                    <TableCell>{user.userId}</TableCell>
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

            {/* Dialog */}
            <AddUserDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onAddUser={handleAddUser}
            />

            {/* Phân trang */}
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
