import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HostInfoDialog = ({ isOpen, onClose, hostData, onApprove, onReject }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thông tin chủ trọ</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Host ID</label>
                        <Input value={hostData?.id || ""} readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số CMND/CCCD</label>
                        <Input value={hostData?.id_card || ""} readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                        <Input value={hostData?.name || ""} readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                        <Input value={hostData?.date_of_birth || ""} readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nguyên quán</label>
                        <Input value={hostData?.address || ""} readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                        <Input value={hostData?.gender || ""} readOnly />
                    </div>
                </div>
                <DialogFooter className="flex justify-between">
                    <Button variant="secondary" onClick={onReject} className="bg-red-500 text-white">
                        Từ chối duyệt
                    </Button>
                    <Button variant="primary" onClick={onApprove} className="bg-primary text-white">
                        Duyệt
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default HostInfoDialog;
