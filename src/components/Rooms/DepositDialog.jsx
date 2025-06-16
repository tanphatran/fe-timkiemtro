import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DepositDialog = ({
    open,
    onOpenChange,
    room,
    loading,
    onConfirm,
    agreePolicy,
    setAgreePolicy
}) => {
    if (!room) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xác nhận đặt cọc</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-gray-600 mb-4 space-y-2">
                    <div><b>Phòng:</b> {room.title}</div>
                    <div><b>Số tiền cọc:</b> {room.depositAmount?.toLocaleString()} VND</div>
                    <div><b>Thời gian giữ chỗ:</b> 24h</div>
                    <div><b>Chính sách hoàn cọc:</b> Hoàn lại nếu chủ trọ từ chối hoặc hết hạn giữ chỗ.</div>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="agreePolicy"
                        checked={agreePolicy}
                        onChange={e => setAgreePolicy(e.target.checked)}
                        className="mr-2"
                    />
                    <span>
                        <label htmlFor="agreePolicy" className="text-sm">
                            Tôi đã đọc và đồng ý với
                        </label>
                        <span className="inline-block mx-1" />
                        <a
                            href="/deposit-terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-sm underline hover:text-primary/80 transition-colors"
                        >
                            điều khoản đặt cọc.
                        </a>
                    </span>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-4">
                    <Button
                        onClick={onConfirm}
                        disabled={!agreePolicy || loading}
                        className="flex-1"
                        type="button"
                    >
                        {loading ? "Đang xử lý..." : "Xác nhận đặt cọc"}
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline" className="flex-1" type="button">
                            Huỷ
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DepositDialog; 