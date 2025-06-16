import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axiosClient from "@/apis/axiosClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { MdHome, MdPerson, MdBusiness, MdInfo } from "react-icons/md";
import ComplaintDialog from "./ComplaintDialog";
import StatusDetailsDialog from "./StatusDetailsDialog";

const DepositDetailsDialog = ({ open, onOpenChange, post }) => {
    const [postDetails, setPostDetails] = useState(null);
    const [depositDetails, setDepositDetails] = useState(null);
    const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchDetails = async () => {
            if (post) {
                try {
                    // Fetch post details
                    const postResponse = await axiosClient.getOne(`post/detail/${post.postUuid}`);
                    if (postResponse.data) {
                        setPostDetails(postResponse.data);
                    }

                    // Fetch deposit details
                    const depositResponse = await axiosClient.getOne(`v1/deposit/${post.depositId}/details`);
                    if (depositResponse.data) {
                        setDepositDetails(depositResponse.data);
                    }
                } catch (error) {
                    console.error("Error fetching details:", error);
                    toast({
                        title: "Lỗi",
                        description: "Không thể lấy thông tin chi tiết",
                        variant: "destructive",
                    });
                }
            }
        };

        fetchDetails();
    }, [post]);

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            const response = await axiosClient.post(`v1/deposit/${post.depositId}/confirm/tenant`);
            if (response.status === "success") {
                toast({ description: "Xác nhận thành công" });
                onOpenChange(false);
            }
        } catch (error) {
            console.error("Error confirming deposit:", error);
            toast({
                title: "Lỗi",
                description: "Không thể xác nhận đặt cọc",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-center">Chi tiết đặt cọc</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-6">
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-primary">
                                    <MdInfo size={20} />
                                    <h4 className="font-semibold text-lg">Trạng thái đặt cọc</h4>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsStatusDialogOpen(true)}
                                    className="flex items-center gap-2"
                                >
                                    <MdInfo size={18} />
                                    Xem chi tiết
                                </Button>
                            </div>
                        </div>

                        {postDetails && (
                            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-primary">
                                    <MdHome size={20} />
                                    <h4 className="font-semibold text-lg">Thông tin bài đăng</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Tiêu đề</p>
                                        <p className="font-medium text-gray-900">{postDetails.title}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Giá phòng</p>
                                        <p className="font-medium text-primary">{postDetails.price.toLocaleString()} đ</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Diện tích</p>
                                        <p className="font-medium text-gray-900">{postDetails.area} m²</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                                        <p className="font-medium text-gray-900">
                                            {postDetails.houseNumber} {postDetails.street}, {postDetails.ward}, {postDetails.district}, {postDetails.city}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {depositDetails && (
                            <div className="space-y-6">
                                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-primary">
                                        <MdPerson size={20} />
                                        <h4 className="font-semibold text-lg">Thông tin người đặt cọc</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">Họ tên</p>
                                            <p className="font-medium text-gray-900">{depositDetails.depositorFullName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">Email</p>
                                            <p className="font-medium text-gray-900">{depositDetails.depositorEmail}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                                            <p className="font-medium text-gray-900">{depositDetails.depositorPhoneNumber}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">Ngày đặt cọc</p>
                                            <p className="font-medium text-gray-900">
                                                {format(new Date(depositDetails.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-primary">
                                        <MdBusiness size={20} />
                                        <h4 className="font-semibold text-lg">Thông tin chủ trọ</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">Họ tên</p>
                                            <p className="font-medium text-gray-900">{depositDetails.landlordFullName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">Email</p>
                                            <p className="font-medium text-gray-900">{depositDetails.landlordEmail}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                                            <p className="font-medium text-gray-900">{depositDetails.landlordPhoneNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="mt-6">
                        {depositDetails?.tenantConfirmed === null && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsComplaintDialogOpen(true)}
                                    disabled={isLoading}
                                >
                                    Khiếu nại
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    disabled={isLoading}
                                >
                                    Xác nhận
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ComplaintDialog
                open={isComplaintDialogOpen}
                onOpenChange={setIsComplaintDialogOpen}
                depositId={post?.depositId}
                onSuccess={() => onOpenChange(false)}
                userType="tenant"
            />

            <StatusDetailsDialog
                open={isStatusDialogOpen}
                onOpenChange={setIsStatusDialogOpen}
                depositId={post?.depositId}
            />
        </>
    );
};

export default DepositDetailsDialog; 