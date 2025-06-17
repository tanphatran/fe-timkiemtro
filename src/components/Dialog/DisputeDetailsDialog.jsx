import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axiosClient from "@/apis/axiosClient";
import ImagePreviewDialog from "@/components/ImagePreview/ImagePreviewDialog";

const DisputeDetailsDialog = ({ open, onClose, postUuid, depositId }) => {
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
            depositId ? axiosClient.getOne(`/v1/deposit/${depositId}/full-details`) : Promise.resolve(null)
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

    const renderConfirmationStatus = (status) => {
        if (status === true) return <span className="text-green-600">Đã xác nhận</span>;
        if (status === false) return <span className="text-red-600">Đã gửi khiếu nại</span>;
        return <span className="text-gray-600">Chưa xác nhận</span>;
    };

    const renderComplaintSection = (type) => {
        const isLandlord = type === 'landlord';
        const prefix = isLandlord ? 'landlord' : 'tenant';
        const name = isLandlord ? depositDetails?.landlordFullName : depositDetails?.depositorFullName;

        if (depositDetails?.[`${prefix}Confirmed`] !== false) return null;

        return (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
                <h3 className="text-lg font-semibold mb-2 text-red-600">
                    Khiếu nại từ {isLandlord ? 'chủ nhà' : 'người thuê'} - {name}
                </h3>

                <div className="mb-4">
                    <h4 className="font-medium mb-1">Lý do khiếu nại:</h4>
                    <p className="text-gray-700">{depositDetails?.[`${prefix}ComplaintReason`]}</p>
                </div>

                {depositDetails?.[`${prefix}ComplaintImages`]?.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-medium mb-2">Hình ảnh khiếu nại:</h4>
                        <div className="flex gap-2 overflow-x-auto">
                            {depositDetails[`${prefix}ComplaintImages`].map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Hình ảnh khiếu nại ${index + 1}`}
                                    className="w-32 h-32 rounded-lg border object-cover shadow cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => setSelectedImage(image)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {depositDetails?.[`${prefix}ComplaintVideoUrl`] && (
                    <div>
                        <h4 className="font-medium mb-2">Video khiếu nại:</h4>
                        <video
                            controls
                            className="w-full rounded-lg"
                            src={depositDetails[`${prefix}ComplaintVideoUrl`]}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white shadow-lg rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-red-600">Chi tiết tranh chấp</DialogTitle>
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
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h3 className="text-lg font-semibold mb-2">Thông tin đặt cọc</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div><b>Người đặt cọc:</b> {depositDetails.depositorFullName}</div>
                                            <div><b>Chủ trọ:</b> {depositDetails.landlordFullName}</div>
                                            <div><b>Email:</b> {depositDetails.depositorEmail}</div>
                                            <div><b>Email chủ trọ:</b> {depositDetails.landlordEmail}</div>
                                            <div><b>Số điện thoại:</b> {depositDetails.depositorPhoneNumber}</div>
                                            <div><b>Số điện thoại chủ trọ:</b> {depositDetails.landlordPhoneNumber}</div>
                                            <div>
                                                <b>Trạng thái người thuê:</b>{" "}
                                                {renderConfirmationStatus(depositDetails.tenantConfirmed)}
                                            </div>
                                            <div>
                                                <b>Trạng thái chủ trọ:</b>{" "}
                                                {renderConfirmationStatus(depositDetails.landlordConfirmed)}
                                            </div>
                                            <div><b>Ngày tạo:</b> {new Date(depositDetails.createdAt).toLocaleString('vi-VN')}</div>
                                        </div>
                                    </div>

                                    {/* Hiển thị khiếu nại của chủ nhà */}
                                    {renderComplaintSection('landlord')}

                                    {/* Hiển thị khiếu nại của người thuê */}
                                    {renderComplaintSection('tenant')}
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

export default DisputeDetailsDialog; 