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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import AddEmployeeDialog from "@/components/Admin/AddEmployeeDialog";
import { useNavigate } from "react-router-dom"; // Để điều hướng
import useMeStore from "@/zustand/useMeStore"; // Để lấy thông tin vai trò
import axiosClient from "@/apis/axiosClient"; // Để gọi API

const EmployeeManagement = () => {
    const navigate = useNavigate();
    const { role } = useMeStore(); // Lấy vai trò người dùng từ store
    const [employees, setEmployees] = useState([]);  // Danh sách nhân viên từ API
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang từ API
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Kiểm tra vai trò khi trang được tải
    useEffect(() => {
        if (role !== "ADMIN") {
            navigate("/admin"); // Điều hướng ra trang chủ nếu không phải ADMIN
        }
    }, [role, navigate]);

    // Lấy danh sách quản trị viên từ API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axiosClient.getMany("/user/admin/moderator", {

                    page: currentPage - 1, // API yêu cầu trang bắt đầu từ 0

                });
                console.log(response.data);
                setEmployees(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhân viên:", error);
            }
        };

        fetchEmployees();
    }, [currentPage]); // Gọi lại API khi thay đổi currentPage

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredEmployees = employees.filter(
        (employee) =>
            employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddEmployee = (newEmployee) => {
        console.log("Thêm nhân viên:", newEmployee);
        // Xử lý logic thêm nhân viên vào danh sách
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-gray-700">Quản lý Nhân viên</h1>

                <div className="flex items-center gap-2">
                    {/* Search Bar */}
                    <div className="relative w-64">
                        <AiOutlineSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-10 w-full border-gray-300"
                        />
                    </div>

                    {/* Reload Button */}
                    <Button variant="ghost">
                        <TfiReload size={25} className="text-gray-500" />
                    </Button>

                    {/* Add Employee Button */}
                    <Button
                        variant="default"
                        className="bg-gradient-to-r from-primary to-secondary text-white"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        + Thêm nhân viên
                    </Button>

                    <AddEmployeeDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        onAddEmployee={handleAddEmployee}
                    />

                    {/* Export Button */}
                    <Button variant="default" className="bg-white border border-primary text-gray">
                        Xuất file
                    </Button>
                </div>
            </div>

            {/* Employee Table */}
            <div className="rounded-lg border bg-white shadow-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-primary/5 text-black font-bold">
                            <TableHead>#</TableHead>
                            <TableHead>Họ & Tên</TableHead>
                            <TableHead>Ngày sinh</TableHead>
                            <TableHead>Địa chỉ</TableHead>
                            <TableHead>Ngày cập nhật</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((employee, index) => (
                                <TableRow key={employee.userId}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{employee.fullName}</TableCell>
                                    <TableCell>{employee.dateOfBirth}</TableCell>
                                    <TableCell>{employee.address}</TableCell>
                                    <TableCell>
                                        {employee.updatedAt
                                            ? new Date(employee.updatedAt).toLocaleString("vi-VN")
                                            : "Chưa cập nhật"}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            className="text-red-500 border-red-500"
                                        >
                                            Block
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Không tìm thấy nhân viên
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-end">
                <PaginationAdmin
                    total={totalPages} // Sử dụng tổng số trang từ API
                    page={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};

export default EmployeeManagement;
