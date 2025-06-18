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
import RefundDetailsDialog from "@/components/Dialog/RefundDetailsDialog";

const RefundManagement = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("pending");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDeposit, setSelectedDeposit] = useState(null);
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
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
                case "pending":
                    endpoint = "/v1/deposit/status/multiplepending";
                    break;
                case "success":
                    endpoint = "/v1/deposit/status/multiplesuccess";
                    break;
                default:
                    endpoint = "/v1/deposit/status/multiplepending";
            }

            const response = await axiosClient.get(endpoint, {
                params: {
                    page: page - 1,
                    size: 10
                }
            });
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

    const handleViewDetails = (deposit) => {
        setSelectedDeposit(deposit);
        setPostUuid(deposit.postUuid);
        setIsRefundDialogOpen(true);
    };

    const getStatusText = (status) => {
        switch (status) {
            case "CONFIRMEDPENDING":
                return "Giao dịch thuận lợi";
            case "REFUNDED":
                return "Người thuê chờ hoàn";
            case "COMMISSION":
                return "Chủ trọ chờ hoàn";
            case "SUCCESS":
                return "Giao dịch thuận lợi";
            case "COMMISSIONSUCCESS":
                return "Đã thanh toán chủ trọ";
            case "REFUNDEDSUCCESS":
                return "Đã thanh toán người thuê";
            default:
                return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "SUCCESS":
            case "CONFIRMEDPENDING":
                return "text-green-600";
            case "REFUNDED":
            case "REFUNDEDSUCCESS":
                return "text-yellow-600";
            case "COMMISSION":
            case "COMMISSIONSUCCESS":
                return "text-blue-600";
            default:
                return "text-gray-600";
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Tabs và Tìm kiếm */}
            <div className="flex items-center justify-between mb-4">
                <Tabs defaultValue="pending" onValueChange={handleTabChange}>
                    <TabsList>
                        <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
                        <TabsTrigger value="success">Đã thanh toán</TabsTrigger>
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
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan="6" className="text-center">Đang tải dữ liệu...</TableCell>
                            </TableRow>
                        ) : deposits.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan="6" className="text-center">Không có dữ liệu</TableCell>
                            </TableRow>
                        ) : (
                            deposits.map((deposit) => (
                                <TableRow
                                    key={deposit.depositId}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleViewDetails(deposit)}
                                >
                                    <TableCell className="text-center">{deposit.depositId}</TableCell>
                                    <TableCell>{formatCurrency(deposit.amount)}</TableCell>
                                    <TableCell>{deposit.paymentMethod}</TableCell>
                                    <TableCell>{deposit.transactionId || "N/A"}</TableCell>
                                    <TableCell>
                                        <span className={getStatusColor(deposit.status)}>
                                            {getStatusText(deposit.status)}
                                        </span>
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog chi tiết hoàn cọc */}
            <RefundDetailsDialog
                open={isRefundDialogOpen}
                onClose={() => setIsRefundDialogOpen(false)}
                postUuid={postUuid}
                depositId={selectedDeposit?.depositId}
                onSuccess={() => fetchData(activeTab, currentPage)}
                activeTab={activeTab}
            />

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

export default RefundManagement; 