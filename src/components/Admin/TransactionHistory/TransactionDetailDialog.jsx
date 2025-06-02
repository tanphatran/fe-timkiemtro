import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axiosClient from "@/apis/axiosClient";
import { format } from "date-fns";

const TransactionDetailDialog = ({ isOpen, onClose, paymentId }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDetail = async () => {
        if (!paymentId) return;
        setLoading(true);
        try {
            const res = await axiosClient.get(`/payment-histories/admin/${paymentId}`);
            setDetail(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy chi tiết giao dịch", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchDetail();
        }
    }, [isOpen, paymentId]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Chi tiết giao dịch #{paymentId}</DialogTitle>
                </DialogHeader>
                {loading ? (
                    <div>Đang tải...</div>
                ) : detail ? (
                    <div className="space-y-2">
                        <p><strong>Mã giao dịch:</strong> {detail.transactionCode}</p>
                        <p><strong>Thông tin đơn hàng:</strong> {detail.orderInfo}</p>
                        <p><strong>Số tiền:</strong> {detail.paymentAmount.toLocaleString()}đ</p>
                        <p><strong>Thời gian thanh toán:</strong> {format(new Date(detail.paymentTime), "dd/MM/yyyy HH:mm")}</p>
                        <p><strong>Mã phản hồi:</strong> {detail.responseCode}</p>
                        <hr />
                        <p><strong>Người thanh toán:</strong> {detail.fullName}</p>
                        <p><strong>Email:</strong> {detail.email}</p>
                        <p><strong>Số điện thoại:</strong> {detail.phoneNumber}</p>
                    </div>
                ) : (
                    <div>Không tìm thấy chi tiết giao dịch.</div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default TransactionDetailDialog;
