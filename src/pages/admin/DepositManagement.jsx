import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TfiReload } from "react-icons/tfi";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import axiosClient from "@/apis/axiosClient";
import { useToast } from "@/hooks/use-toast";
import PostDetailsDialog from "@/components/Dialog/PostDetailsDialog";
import DisputeDetailsDialog from "@/components/Dialog/DisputeDetailsDialog";

const DepositManagement = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("paid");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDeposit, setSelectedDeposit] = useState(null);
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
    const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
    const [postUuid, setPostUuid] = useState(null);

    const handleTabChange = (value) => {
        setActiveTab(value);
        setCurrentPage(1);
        setSelectedDeposit(null);
    };

    const fetchData = async (tab, page) => {
        setLoading(true);
        try {
            let endpoint = "";
            switch (tab) {
                case "paid":
                    endpoint = "/v1/deposit/status/paid";
                    break;
                case "confirmed":
                    endpoint = "/v1/deposit/status/confirmed";
                    break;
                case "cancelled":
                    endpoint = "/v1/deposit/status/canelled";
                    break;
                default:
                    endpoint = "/v1/deposit/status/paid";
            }

            const response = await axiosClient.get(endpoint, { page: page - 1 });
            setDeposits(response.data.content);
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

    useEffect(() => {
        fetchData(activeTab, currentPage);
    }, [activeTab, currentPage]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleViewPost = (deposit) => {
        setSelectedDeposit(deposit);
        setPostUuid(deposit.postUuid);
        if (activeTab === "cancelled") {
            setIsDisputeDialogOpen(true);
        } else {
            setIsPostDialogOpen(true);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Tabs và Tìm kiếm */}
            <div className="flex items-center justify-between mb-4">
                <Tabs defaultValue="paid" onValueChange={handleTabChange}>
                    <TabsList>
                        <TabsTrigger value="paid">Đã thanh toán</TabsTrigger>
                        <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
                        <TabsTrigger value="cancelled">Tranh chấp</TabsTrigger>
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
                            <TableHead className="text-center">ID</TableHead>
                            <TableHead>Số tiền</TableHead>
                            <TableHead>Phương thức thanh toán</TableHead>
                            <TableHead>Mã giao dịch</TableHead>
                            <TableHead>Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center">Đang tải dữ liệu...</TableCell>
                            </TableRow>
                        ) : deposits.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center">Không có dữ liệu</TableCell>
                            </TableRow>
                        ) : (
                            deposits.map((deposit) => (
                                <TableRow
                                    key={deposit.depositId}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleViewPost(deposit)}
                                >
                                    <TableCell className="text-center">{deposit.depositId}</TableCell>
                                    <TableCell>{formatCurrency(deposit.amount)}</TableCell>
                                    <TableCell>{deposit.paymentMethod}</TableCell>
                                    <TableCell>{deposit.transactionId || "N/A"}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog chi tiết bài đăng */}
            {activeTab !== "cancelled" && (
                <PostDetailsDialog
                    open={isPostDialogOpen}
                    onClose={() => setIsPostDialogOpen(false)}
                    postUuid={postUuid}
                    depositId={selectedDeposit?.depositId}
                />
            )}

            {/* Dialog chi tiết tranh chấp */}
            {activeTab === "cancelled" && (
                <DisputeDetailsDialog
                    open={isDisputeDialogOpen}
                    onClose={() => setIsDisputeDialogOpen(false)}
                    postUuid={postUuid}
                    depositId={selectedDeposit?.depositId}
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

export default DepositManagement; 