import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axiosClient from "@/apis/axiosClient";
import ImagePreviewDialog from "@/components/ImagePreview/ImagePreviewDialog";
import { useToast } from "@/hooks/use-toast";
import ConfirmDialog from "./ConfirmDialog";

const PostDetailsDialog = ({ open, onClose, postUuid, depositId, onSuccess }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [depositDetails, setDepositDetails] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isRefunding, setIsRefunding] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        if (!open || !postUuid) return;
        setLoading(true);
        setError(null);
        Promise.all([
            axiosClient.getOne(`/post/detail/${postUuid}`),
            depositId ? axiosClient.getOne(`/v1/deposit/${depositId}/details`) : Promise.resolve(null)
        ])
            .then(([postData, depositData]) => {
                if (postData.status === "success") {
                    setPost(postData.data);
                } else {
                    setError(postData.message || "Không thể tải dữ liệu bài đăng.");
                }
                if (depositData?.status === "success") {
                    setDepositDetails(depositData.data);
                }
            })
            .catch(() => setError("Không thể tải dữ liệu bài đăng."))
            .finally(() => setLoading(false));
    }, [open, postUuid, depositId]);

    const handleRefund = async () => {
        if (!depositId) return;

        setIsRefunding(true);
        try {
            const response = await axiosClient.post(`/v1/deposit/pay-success/${depositId}`);
            if (response.status === "success") {
                toast({
                    title: "Thành công",
                    description: "Đã chuyển cọc thành công",
                });
                onSuccess?.();
                onClose();
            } else {
                toast({
                    title: "Lỗi",
                    description: response.message || "Không thể chuyển cọc",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Không thể chuyển cọc, vui lòng thử lại",
                variant: "destructive",
            });
        } finally {
            setIsRefunding(false);
            setShowConfirmDialog(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white shadow-lg rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Chi tiết đặt cọc</DialogTitle>
                    </DialogHeader>

                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : post ? (
                        <>
                            <p><strong>{post.title}</strong></p>
                            <DialogDescription className="text-sm">{post.description}</DialogDescription>

                            <Separator className="my-1" />

                            <div className="space-y-2">
                                {/* Nội dung chính */}
                                <div className="grid grid-cols-2 gap-2">
                                    <h1><strong>Giá thuê:</strong> {post.price?.toLocaleString()} VND</h1>
                                    <h1><strong>Diện tích:</strong> {post.area} m²</h1>
                                    <h1><strong>Số phòng:</strong> {post.numberOfRooms}</h1>
                                    <h1><strong>Giá điện:</strong> {post.electricityPrice?.toLocaleString()} VND</h1>
                                    <h1><strong>Giá nước:</strong> {post.waterPrice?.toLocaleString()} VND</h1>
                                    <h1><strong>Tiền đặt cọc:</strong> {post.depositAmount?.toLocaleString()} VND</h1>
                                    <h1>
                                        <strong>Địa chỉ:</strong>{" "}
                                        {`${post.houseNumber} ${post.street}, ${post.ward}, ${post.district}, ${post.city}`}
                                    </h1>
                                </div>

                                <Separator className="my-1" />

                                {/* Hình ảnh */}
                                <div>
                                    <strong>Hình ảnh:</strong>
                                    <div className="mt-2 flex gap-2 overflow-x-auto">
                                        {post.postImages?.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Hình ảnh ${index + 1}`}
                                                className="w-32 h-32 rounded-lg border object-cover shadow cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => setSelectedImage(image)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                {depositDetails && (
                                    <>
                                        <Separator className="my-4" />
                                        <div className="bg-gray-50 p-0 rounded-lg">
                                            <h3 className="text-lg font-semibold mb-2">Thông tin đặt cọc</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div><b>Người đặt cọc:</b> {depositDetails.depositorFullName}</div>
                                                <div><b>Email:</b> {depositDetails.depositorEmail}</div>
                                                <div><b>Số điện thoại:</b> {depositDetails.depositorPhoneNumber}</div>
                                                <div><b>Chủ nhà:</b> {depositDetails.landlordFullName}</div>
                                                <div><b>Email chủ nhà:</b> {depositDetails.landlordEmail}</div>
                                                <div><b>Số điện thoại chủ nhà:</b> {depositDetails.landlordPhoneNumber}</div>
                                                <div><b>Trạng thái xác nhận chủ nhà:</b> {depositDetails.landlordConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</div>
                                                <div><b>Trạng thái xác nhận người thuê:</b> {depositDetails.tenantConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</div>
                                                <div><b>Ngày tạo:</b> {new Date(depositDetails.createdAt).toLocaleString('vi-VN')}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <Separator className="my-4" />

                            {/* Nút đóng và chuyển cọc */}
                            <div className="flex justify-end gap-2">
                                {depositDetails?.landlordConfirmed && depositDetails?.tenantConfirmed && (
                                    <Button
                                        onClick={() => setShowConfirmDialog(true)}
                                        disabled={isRefunding}
                                        className="bg-primary hover:bg-primary/80 text-white"
                                    >
                                        {isRefunding ? "Đang xử lý..." : "Chuyển cọc"}
                                    </Button>
                                )}
                                <Button variant="outline" onClick={onClose} className="text-stone-700 border-stone-700">
                                    Đóng
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500">Không có dữ liệu bài viết.</p>
                    )}
                </DialogContent>

                {/* Dialog xem ảnh */}
                <ImagePreviewDialog
                    isOpen={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                    imageUrl={selectedImage}
                />
            </Dialog>

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title="Xác nhận chuyển cọc"
                description="Bạn có chắc chắn muốn chuyển cọc cho chủ trọ? Hành động này không thể hoàn tác."
                onConfirm={handleRefund}
                onCancel={() => setShowConfirmDialog(false)}
                isLoading={isRefunding}
            />
        </>
    );
};

export default PostDetailsDialog; 