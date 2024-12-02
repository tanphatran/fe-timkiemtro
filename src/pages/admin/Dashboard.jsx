import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineReload } from "react-icons/ai";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import PostDetailsDialog from "@/components/Admin/Posts/PostDetailsDialog";
import { TfiReload } from "react-icons/tfi";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("pending");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPost, setSelectedPost] = useState(null); // Quản lý trạng thái post được chọn
    const totalPage = 1;

    // Dữ liệu mẫu cho từng tab
    const data = {
        pending: [
            {
                id: 1,
                title: "Nhà trọ cấp thuê Gò Vấp 2",
                description: "Nhà cho thuê giá rẻ, điện nước giá nhà nước, có chỗ đậu xe riêng. Có nhiều phòng trống. Có thể ở được liền, điện 3k nước 15k q khối.",
                author: "Nguyễn Kiều Anh",
                date: "06-06-2024",
                postImages: [
                    "https://cloud.mogi.vn/images/2023/11/17/565/a955f0448ece439189b8f6bbda4b917e.jpg",
                    "https://cloud.mogi.vn/images/2024/11/20/369/a9b7bc00c2e84ecab35f64136834f9a1.jpg",
                    "https://cloud.mogi.vn/images/2023/11/17/564/bb3a2b701a3845e998f0391de444aae8.jpg",
                    "https://cloud.mogi.vn/images/2024/05/15/424/58d9e3ab867e40d6b7d09b5fe07a5432.jpg",
                    "https://cloud.mogi.vn/images/2023/11/17/567/25dd7852e66f45a69690bdabde1485e2.jpg"
                ],
                price: 5,
                area: 20,
                furnitureStatus: "FULL",
                numberOfRooms: 2,
                electricityPrice: 3,
                waterPrice: 1.5,
                city: "Hà Nội",
                district: "Cầu Giấy",
                ward: "Dịch Vọng",
                street: "Trần Thái Tông",
                houseNumber: "12",
                licensePcccUrl: "https://www.giayphepvesinhantoanthucpham.com/wp-content/uploads/2022/10/dich-vu-uy-tin-lam-nhanh-giay-phep-ho-kinh-doanh-quan-tan-phu-12097.jpg",
                licenseBusinessUrl: "https://fahasasg.com.vn/wp-content/uploads/2022/06/GIAY-PHEP-DKKD_001.jpg",
            },
        ],
        approved: [
            {
                id: 2,
                title: "Phòng trọ gần Đại học Kinh tế",
                description: "Phòng mới, đầy đủ tiện nghi, gần trường đại học và chợ",
                author: "Phạm Minh Tuấn",
                date: "04-06-2024",
                postImages: [
                    "https://via.placeholder.com/100",
                    "https://via.placeholder.com/100"
                ],
                price: 6.5,
                area: 25,
                furnitureStatus: "SEMI",
                numberOfRooms: 1,
                electricityPrice: 4,
                waterPrice: 2,
                city: "Đà Nẵng",
                district: "Hải Châu",
                ward: "Hòa Cường Nam",
                street: "Lê Thanh Nghị",
                houseNumber: "45A",
                licensePcccUrl: "https://via.placeholder.com/100",
                licenseBusinessUrl: "https://via.placeholder.com/100",
            },
        ],
        rejected: [
            {
                id: 3,
                title: "Phòng trọ nhỏ gọn gần trung tâm TP.HCM",
                description: "Phòng hơi nhỏ nhưng tiện nghi, thích hợp cho sinh viên",
                author: "Lê Thị Ngọc Hà",
                date: "03-06-2024",
                postImages: [
                    "https://via.placeholder.com/100",
                    "https://via.placeholder.com/100"
                ],
                price: 3.5,
                area: 15,
                furnitureStatus: "BASIC",
                numberOfRooms: 1,
                electricityPrice: 5,
                waterPrice: 3,
                city: "TP.HCM",
                district: "Quận 1",
                ward: "Phạm Ngũ Lão",
                street: "Đề Thám",
                houseNumber: "18",
                licensePcccUrl: "https://via.placeholder.com/100",
                licenseBusinessUrl: "https://via.placeholder.com/100",
            },
        ],
        reported: [
            {
                id: 4,
                title: "Phòng trọ bị báo cáo ở Cần Thơ",
                description: "Bị báo cáo do thông tin không chính xác về giá thuê",
                author: "Vũ Hồng Anh",
                date: "02-06-2024",
                postImages: [
                    "https://via.placeholder.com/100",
                    "https://via.placeholder.com/100"
                ],
                price: 2,
                area: 10,
                furnitureStatus: "NONE",
                numberOfRooms: 1,
                electricityPrice: 6,
                waterPrice: 4,
                city: "Cần Thơ",
                district: "Ninh Kiều",
                ward: "Tân An",
                street: "Nguyễn Trãi",
                houseNumber: "27",
                licensePcccUrl: "https://via.placeholder.com/100",
                licenseBusinessUrl: "https://via.placeholder.com/100",
            },
        ],
    };


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
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Mô tả</TableHead>
                            <TableHead>Tác giả</TableHead>
                            <TableHead>Lần cập nhật cuối</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data[activeTab].map((item) => (
                            <TableRow key={item.id} onClick={() => setSelectedPost(item)} className="cursor-pointer hover:bg-gray-100">
                                <TableCell>{item.id}</TableCell>
                                <TableCell className="truncate max-w-[120px]">{item.title}</TableCell>
                                <TableCell className="truncate max-w-[300px]">{item.description}</TableCell>
                                <TableCell>{item.author}</TableCell>
                                <TableCell>{item.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Popup hiển thị chi tiết */}
            <PostDetailsDialog data={selectedPost} onCancel={() => setSelectedPost(null)} />

            {/* Phân trang */}
            <div className="mt-4 flex justify-end items-center gap-4">
                <Pagination total={totalPage} page={currentPage} onChange={(page) => setCurrentPage(page)} />
                <span className="text-sm text-gray-600">Trang {currentPage} / {totalPage}</span>
            </div>
        </div>
    );
};

export default Dashboard;
