import React, { useState } from "react";
import AddUserDialog from "@/components/Admin/AddUserDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import { AiOutlineSearch } from "react-icons/ai";
import { TfiReload } from "react-icons/tfi";
import { Input } from "@/components/ui/input";

const UserManagement = () => {
    const [users, setUsers] = useState([
        {
            id: "1",
            email: "092442452345",
            dateOfBirth: "1995-03-15",
            address: "123 Lê Lợi, Quận 1, TP. HCM",
            registrationDate: "2024-01-02",
        },
        {
            id: "2",
            email: "093345512132",
            dateOfBirth: "1998-06-22",
            address: "456 Phạm Văn Đồng, Thủ Đức, TP. HCM",
            registrationDate: "2024-01-05",
        },
        {
            id: "3",
            email: "095345513138",
            dateOfBirth: "2000-12-05",
            address: "789 Nguyễn Trãi, Quận 5, TP. HCM",
            registrationDate: "2024-01-10",
        },
        {
            id: "4",
            email: "093213345512",
            dateOfBirth: "1993-10-01",
            address: "321 Trường Chinh, Quận Tân Bình, TP. HCM",
            registrationDate: "2024-02-01",
        },
        {
            id: "5",
            email: "091255132153",
            dateOfBirth: "1996-04-18",
            address: "654 Điện Biên Phủ, Bình Thạnh, TP. HCM",
            registrationDate: "2024-02-10",
        },
        {
            id: "6",
            email: "095255132132",
            dateOfBirth: "1999-08-09",
            address: "987 Lý Thái Tổ, Quận 3, TP. HCM",
            registrationDate: "2024-02-15",
        },
        {
            id: "7",
            email: "091251321234",
            dateOfBirth: "1994-11-30",
            address: "789 Bạch Đằng, Quận Bình Thạnh, TP. HCM",
            registrationDate: "2024-03-01",
        },
        {
            id: "8",
            email: "091255132134",
            dateOfBirth: "1997-05-07",
            address: "234 Võ Văn Tần, Quận 10, TP. HCM",
            registrationDate: "2024-03-05",
        },
        {
            id: "9",
            email: "pham.quoc.i@example.com",
            dateOfBirth: "2001-09-19",
            address: "123 Hoàng Diệu, Quận 4, TP. HCM",
            registrationDate: "2024-03-20",
        },
        {
            id: "10",
            email: "vu.minh.j@example.com",
            dateOfBirth: "1989-02-14",
            address: "567 Cách Mạng Tháng Tám, Quận 10, TP. HCM",
            registrationDate: "2024-03-25",
        },
        {
            id: "11",
            email: "nguyen.tan.k@example.com",
            dateOfBirth: "1992-07-21",
            address: "987 Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP. HCM",
            registrationDate: "2024-04-01",
        },
        {
            id: "12",
            email: "tran.hoang.l@example.com",
            dateOfBirth: "2002-01-03",
            address: "654 Trần Quang Khải, Quận 1, TP. HCM",
            registrationDate: "2024-04-10",
        },
        {
            id: "13",
            email: "pham.thi.m@example.com",
            dateOfBirth: "1990-03-23",
            address: "321 Nguyễn Đình Chiểu, Quận 3, TP. HCM",
            registrationDate: "2024-04-15",
        },
        {
            id: "14",
            email: "nguyen.hoang.n@example.com",
            dateOfBirth: "1995-06-12",
            address: "123 Võ Văn Kiệt, Quận 5, TP. HCM",
            registrationDate: "2024-04-20",
        },
        {
            id: "15",
            email: "tran.van.o@example.com",
            dateOfBirth: "1993-11-08",
            address: "456 Lê Quang Định, Bình Thạnh, TP. HCM",
            registrationDate: "2024-05-01",
        },
        {
            id: "16",
            email: "le.thi.p@example.com",
            dateOfBirth: "1999-04-30",
            address: "789 Hàm Nghi, Quận 1, TP. HCM",
            registrationDate: "2024-05-05",
        },
        {
            id: "17",
            email: "pham.van.q@example.com",
            dateOfBirth: "2000-08-25",
            address: "321 Đinh Tiên Hoàng, Bình Thạnh, TP. HCM",
            registrationDate: "2024-05-10",
        },
        {
            id: "18",
            email: "nguyen.van.r@example.com",
            dateOfBirth: "1994-02-28",
            address: "654 Nguyễn Hữu Cảnh, Quận 7, TP. HCM",
            registrationDate: "2024-05-15",
        },
        {
            id: "19",
            email: "tran.hoang.s@example.com",
            dateOfBirth: "1991-10-18",
            address: "123 Cộng Hòa, Quận Tân Bình, TP. HCM",
            registrationDate: "2024-06-01",
        },
        {
            id: "20",
            email: "le.anh.t@example.com",
            dateOfBirth: "1998-12-29",
            address: "456 Huỳnh Tấn Phát, Quận 7, TP. HCM",
            registrationDate: "2024-06-10",
        },
        {
            id: "21",
            email: "pham.quoc.u@example.com",
            dateOfBirth: "1997-07-16",
            address: "789 Tô Hiến Thành, Quận 10, TP. HCM",
            registrationDate: "2024-06-20",
        },
        {
            id: "22",
            email: "nguyen.minh.v@example.com",
            dateOfBirth: "1996-05-04",
            address: "321 Bà Huyện Thanh Quan, Quận 3, TP. HCM",
            registrationDate: "2024-07-01",
        },
        {
            id: "23",
            email: "tran.hoang.w@example.com",
            dateOfBirth: "1993-01-11",
            address: "654 Trường Sa, Quận Phú Nhuận, TP. HCM",
            registrationDate: "2024-07-05",
        },
        {
            id: "24",
            email: "le.tan.x@example.com",
            dateOfBirth: "1988-09-30",
            address: "789 Hoàng Hoa Thám, Quận Tân Bình, TP. HCM",
            registrationDate: "2024-07-10",
        },
        {
            id: "25",
            email: "pham.minh.y@example.com",
            dateOfBirth: "2001-11-19",
            address: "123 Hồng Hà, Quận Tân Bình, TP. HCM",
            registrationDate: "2024-07-15",
        },
    ]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Số người dùng hiển thị trên mỗi trang

    // Tính toán tổng số trang
    const totalPages = Math.ceil(users.length / itemsPerPage);

    // Lấy danh sách người dùng hiển thị cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

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
            {/* Table */}
            <div className="rounded-lg border bg-white shadow-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-primary/5 text-black font-bold">
                            <TableHead>#</TableHead>
                            <TableHead>số điện thoại</TableHead>
                            <TableHead>Ngày sinh</TableHead>
                            <TableHead>Địa chỉ thường trú</TableHead>
                            <TableHead>Ngày đăng ký</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.dateOfBirth}</TableCell>
                                    <TableCell>{user.address}</TableCell>
                                    <TableCell>{user.registrationDate}</TableCell>
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
                    total={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default UserManagement;
