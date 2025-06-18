import React, { useEffect, useState } from "react";
import axiosClient from "@/apis/axiosClient"; // Import axiosClient
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImagePreviewDialog from "@/components/ImagePreview/ImagePreviewDialog";
import { useToast } from "@/hooks/use-toast";

const HostInfoDialog = ({ isOpen, onClose, hostId, onApprove, onReject, isApprovedTab }) => {
    const [hostData, setHostData] = useState(null); // State to store the host data
    const [loading, setLoading] = useState(false);  // Loading state
    const [error, setError] = useState(null);       // Error state
    const [selectedImage, setSelectedImage] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen && hostId) {
            setLoading(true);
            setError(null);

            const fetchHostData = async () => {
                try {
                    const response = await axiosClient.getOne(`/user/admin/detail/${hostId}`);
                    console.log(response.data);
                    setHostData(response.data);


                } catch (err) {
                    console.error("Error fetching host data:", err);
                    setError("Không thể tải thông tin chủ trọ.");
                } finally {
                    setLoading(false);
                }
            };

            fetchHostData();
        }
    }, [isOpen, hostId]);

    const handleLockAccount = async () => {
        try {
            await axiosClient.put(`/user/admin/lock-account/${hostId}`);
            toast({
                title: "Khóa tài khoản thành công",
                description: "Tài khoản đã bị khóa.",
                variant: "default",
            });
            onClose();
        } catch (err) {
            console.error("Lỗi khi khóa tài khoản:", err);
            toast({
                title: "Khóa tài khoản thất bại",
                description: "Đã xảy ra lỗi khi khóa tài khoản.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Thông tin chủ trọ</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[60vh] px-1">
                    {loading && <p>Đang tải...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {hostData ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">User ID</label>
                                <Input value={hostData.userId || ""} readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <Input value={hostData.phoneNumber || ""} readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                                <Input value={hostData.fullName || ""} readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                                <Input value={hostData.dateOfBirth || ""} readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <Input value={hostData.address || ""} readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số CCCD</label>
                                <Input value={hostData.cccdNumber || ""} readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                                <Input value={hostData.gender || ""} readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quốc tịch</label>
                                <Input value={hostData.nationality || ""} readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nguyên quán</label>
                                <Input value={hostData.hometown || ""} readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngày cấp CCCD</label>
                                <Input value={hostData.cccdIssueDate || ""} readOnly />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mặt trước CCCD:</label>
                                    <div className="mt-2">
                                        {hostData.frontCccdUrl && hostData.frontCccdUrl !== "null" ? (
                                            <img
                                                src={hostData.frontCccdUrl}
                                                alt="Mặt trước CCCD"
                                                className="w-full h-48 rounded-lg border object-cover shadow cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => setSelectedImage(hostData.frontCccdUrl)}
                                            />
                                        ) : (
                                            <div className="w-full h-48 rounded-lg border flex items-center justify-center bg-gray-50 text-gray-500">
                                                Không có ảnh CCCD mặt trước
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mặt sau CCCD:</label>
                                    <div className="mt-2">
                                        {hostData.backCccdUrl && hostData.backCccdUrl !== "null" ? (
                                            <img
                                                src={hostData.backCccdUrl}
                                                alt="Mặt sau CCCD"
                                                className="w-full h-48 rounded-lg border object-cover shadow cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => setSelectedImage(hostData.backCccdUrl)}
                                            />
                                        ) : (
                                            <div className="w-full h-48 rounded-lg border flex items-center justify-center bg-gray-50 text-gray-500">
                                                Không có ảnh CCCD mặt sau
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500">Không có thông tin chủ trọ.</p>
                    )}
                </div>

                <div className="mt-3 flex justify-end gap-3">
                    {hostData?.isLandlordActivated !== "APPROVED" && hostData?.isLandlordActivated !== "REJECTED" && (
                        <>
                            <Button variant="default" onClick={onApprove} className="bg-gradient-to-r from-primary to-secondary text-white">
                                Duyệt
                            </Button>
                            <Button variant="outline" onClick={onReject} className="text-red-600 border-red-600">
                                Từ chối
                            </Button>
                        </>
                    )}
                    {isApprovedTab && (
                        <Button variant="outline" onClick={handleLockAccount} className="text-red-600 border-red-600">
                            Khóa tài khoản
                        </Button>
                    )}
                    <Button variant="outline" onClick={onClose} className="text-stone-700 border-stone-700">
                        Hủy
                    </Button>
                </div>
            </DialogContent>

            {/* Image Preview Dialog */}
            <ImagePreviewDialog
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageUrl={selectedImage}
            />
        </Dialog>
    );
};

export default HostInfoDialog;
