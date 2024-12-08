import React, { useState } from "react";
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

const HostManagement = () => {
    const [activeTab, setActiveTab] = useState("pending");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedHost, setSelectedHost] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const data = {
        pending: [
            {
                id: "666597c19cf36db69c2ea79d",
                name: "Nguyễn Văn Tín",
                address: "24 Lò Đúc, Phường Phạm Đình Hổ, Quận Hai Bà Trưng, Hà Nội",
                date_of_birth: "02-01-2004",
                date: "09-06-2024",
                gender: "Nam",
                id_card: "23012345678",
            },
            {
                id: "5356ed9sfsa6665957ff9abf9",
                name: "Lâm Hoàng",
                address: "112/32 Bùi Quang Là, Phường 12, Quận Gò Vấp, TP Hồ Chí Minh",
                date_of_birth: "21-04-1996",
                date: "10-06-2024",
                gender: "Nam",
                id_card: "2341223512",
            },
            {
                id: "345cf36db69c2ea7797c199d",
                name: "Duyên Trương",
                address: "32 Phan Văn Trị, Phường 12, Quận Gò Vấp, TP Hồ Chí Minh",
                date_of_birth: "05-12-1992",
                date: "09-06-2024",
                gender: "Nữ",
                id_card: "35236127064",
            },
            {
                id: "6957ff9a5356ed66593d4bf9",
                name: "Hoàng Mỹ An",
                address: "2 Trần Công Hoan, Xã Đồng Phú, Huyện Chương Mỹ, Hà Nội",
                date_of_birth: "10-02-1997",
                date: "10-06-2024",
                gender: "Nam",
                id_card: "20112345678",
            },
            {
                id: "597c19cf9c2ea79d36db6666",
                name: "Lâm Văn Thái",
                address: "234 Thanh Xuân, Phường 1, Quận Cầu Giấy, Hà Nội",
                date_of_birth: "31-12-1992",
                date: "23-06-2024",
                gender: "Nam",
                id_card: "12647108763",
            },
            {
                id: "66ed93d4bf9665957ff9a535",
                name: "Nguyễn Văn Sang",
                address: "32 Lã Xuân Oai, Phường 2, Quận 9, TP Hồ Chí Minh",
                date_of_birth: "15-12-2001",
                date: "14-06-2024",
                gender: "Nam",
                id_card: "25671034523",
            },
        ],
        approved: [],
        rejected: [],
    };
    const handleOpenDialog = (host) => {
        setSelectedHost(host);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedHost(null);
    };

    const handleApprove = () => {
        console.log("Duyệt:", selectedHost);
        handleCloseDialog();
    };

    const handleReject = () => {
        console.log("Từ chối:", selectedHost);
        handleCloseDialog();
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
                        {data[activeTab]?.length > 0 ? (
                            data[activeTab].map((item) => (
                                <TableRow
                                    key={item.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleOpenDialog(item)}
                                >
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.date_of_birth}</TableCell>
                                    <TableCell>{item.address}</TableCell>
                                    <TableCell>{item.date}</TableCell>
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
                    total={1}
                    page={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
            {selectedHost && (
                <HostInfoDialog
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    hostData={selectedHost}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
};

export default HostManagement;
