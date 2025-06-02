import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axiosClient from "@/apis/axiosClient";
import { useToast } from "@/hooks/use-toast";
import PaginationAdmin from "@/components/Admin/PaginationAdmin";
import { format } from "date-fns";
import TransactionDetailDialog from "@/components/Admin/TransactionHistory/TransactionDetailDialog";

const TransactionHistoryAdmin = () => {
    const [transactions, setTransactions] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchTransactions = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/payment-histories/admin/all?page=${page - 1}&size=10`);
            setTransactions(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            toast({
                title: "Lỗi khi tải danh sách giao dịch",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions(currentPage);
    }, [currentPage]);

    const handleRowClick = (id) => {
        setSelectedId(id);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setSelectedId(null);
        setDialogOpen(false);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-xl font-bold mb-4">Lịch sử giao dịch</h2>
            <div className="rounded-lg border bg-white shadow-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-primary/5 text-black font-bold">
                            <TableHead>#</TableHead>
                            <TableHead>Mã giao dịch</TableHead>
                            <TableHead>Thông tin đơn hàng</TableHead>
                            <TableHead>Số tiền</TableHead>
                            <TableHead>Thời gian thanh toán</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : transactions.length > 0 ? (
                            transactions.map((txn) => (
                                <TableRow
                                    key={txn.paymentId}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleRowClick(txn.paymentId)}
                                >
                                    <TableCell>{txn.paymentId}</TableCell>
                                    <TableCell>{txn.transactionCode}</TableCell>
                                    <TableCell>{txn.orderInfo}</TableCell>
                                    <TableCell>{txn.paymentAmount.toLocaleString()}đ</TableCell>
                                    <TableCell>{format(new Date(txn.paymentTime), "dd/MM/yyyy HH:mm")}</TableCell>
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

            {/* Dialog chi tiết */}
            {selectedId && (
                <TransactionDetailDialog
                    isOpen={isDialogOpen}
                    onClose={closeDialog}
                    paymentId={selectedId}
                />
            )}
        </div>
    );
};

export default TransactionHistoryAdmin;
