import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import axiosClient from "@/apis/axiosClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const StatusDetailsDialog = ({ open, onOpenChange, depositId }) => {
    const [fullDepositDetails, setFullDepositDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchDepositDetails = async () => {
            if (open && depositId) {
                try {
                    setIsLoading(true);
                    const response = await axiosClient.getOne(`v1/deposit/${depositId}/full-details`);
                    if (response.data) {
                        setFullDepositDetails(response.data);
                    }
                } catch (error) {
                    console.error("Error fetching deposit details:", error);
                    toast({
                        title: "Lỗi",
                        description: "Không thể lấy thông tin chi tiết",
                        variant: "destructive",
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchDepositDetails();
    }, [open, depositId]);

    const getStatusText = (status) => {
        switch (status) {
            case "PAID":
                return "Đã đặt cọc";
            case "CONFIRMED":
                return "Đã xác nhận";
            case "CONFIRMEDPENDING":
                return "Chờ thanh toán";
            case "SUCCESS":
                return "Đã hoàn tất giao dịch";
            case "CANCELLED":
                return "Đã hủy";
            case "REFUNDED":
                return "Chờ hoàn tiền";
            case "REFUNDEDSUCCESS":
                return "Đã hoàn tiền";
            case "COMMISSION":
                return "Chờ thanh toán chủ trọ";
            case "COMMISSIONSUCCESS":
                return "Đã thanh toán cho chủ trọ";
            default:
                return "Không xác định";
        }
    };

    const getConfirmationStatus = (confirmed) => {
        if (confirmed === null) return "Chưa xác nhận";
        if (confirmed === true) return "Đã xác nhận";
        return "Đã khiếu nại";
    };

    const renderComplaintMedia = (videoUrl, images) => {
        if (!videoUrl && (!images || images.length === 0)) return null;

        return (
            <div className="mt-4 space-y-4">
                {videoUrl && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Video khiếu nại:</p>
                        <video
                            controls
                            className="w-full rounded-lg"
                            src={videoUrl}
                        >
                            Trình duyệt của bạn không hỗ trợ video.
                        </video>
                    </div>
                )}
                {images && images.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Hình ảnh khiếu nại:</p>
                        <div className="grid grid-cols-2 gap-4">
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Hình ảnh khiếu nại ${index + 1}`}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center">Trạng thái đặt cọc</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : fullDepositDetails ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                                <p className="font-medium text-gray-900">{getStatusText(fullDepositDetails.status)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
                                <p className="font-medium text-gray-900">
                                    {format(new Date(fullDepositDetails.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Chủ trọ khiếu nại */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-500">Xác nhận từ chủ trọ</p>
                                    <p className="font-medium text-gray-900">{getConfirmationStatus(fullDepositDetails.landlordConfirmed)}</p>
                                </div>
                                {fullDepositDetails.landlordConfirmed === false && (
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        {fullDepositDetails.landlordComplaintReason && (
                                            <p className="text-sm text-red-600 mb-2">Lý do: {fullDepositDetails.landlordComplaintReason}</p>
                                        )}
                                        {renderComplaintMedia(
                                            fullDepositDetails.landlordComplaintVideoUrl,
                                            fullDepositDetails.landlordComplaintImages
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Người thuê khiếu nại */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-500">Xác nhận từ người thuê</p>
                                    <p className="font-medium text-gray-900">{getConfirmationStatus(fullDepositDetails.tenantConfirmed)}</p>
                                </div>
                                {fullDepositDetails.tenantConfirmed === false && (
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        {fullDepositDetails.tenantComplaintReason && (
                                            <p className="text-sm text-red-600 mb-2">Lý do: {fullDepositDetails.tenantComplaintReason}</p>
                                        )}
                                        {renderComplaintMedia(
                                            fullDepositDetails.tenantComplaintVideoUrl,
                                            fullDepositDetails.tenantComplaintImages
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Không có thông tin chi tiết
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default StatusDetailsDialog; 