import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axiosClient from "@/apis/axiosClient";
import ImagePreviewDialog from "@/components/ImagePreview/ImagePreviewDialog";

const PostDetailsDialog = ({ open, onClose, postUuid, depositId }) => {
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [depositDetails, setDepositDetails] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

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

    return (
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

                        {/* Nút đóng */}
                        <div className="flex justify-end">
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
    );
};

export default PostDetailsDialog; 