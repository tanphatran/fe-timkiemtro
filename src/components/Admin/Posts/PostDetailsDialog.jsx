import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axiosClient from "@/apis/axiosClient"; // Import API client
import ImagePreviewDialog from "@/components/ImagePreview/ImagePreviewDialog";

const PostDetailsDialog = ({ postId, onApprove, onReject, onCancel }) => {
    const [postDetails, setPostDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Gọi API để lấy chi tiết bài viết
    useEffect(() => {
        if (!postId) return;

        const fetchPostDetails = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.getOne(`/post/admin/detail/${postId}`);
                setPostDetails(response.data);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi gọi API:", err);
                setError("Không thể tải chi tiết bài viết.");
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [postId]);

    if (!postId) return null;

    return (
        <Dialog open={!!postId} onOpenChange={onCancel}>
            <DialogContent
                isHideClose={true}
                className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white shadow-lg rounded-lg"
            >
                <DialogTitle className="text-lg font-bold text-red-700">Duyệt bài viết</DialogTitle>
                {loading ? (
                    <p>Đang tải...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : postDetails ? (
                    <>
                        <p><strong>{postDetails.title}</strong></p>
                        <DialogDescription className="text-sm">{postDetails.description}</DialogDescription>

                        <Separator className="my-1" />

                        <div className="space-y-2">
                            {/* Nội dung chính */}
                            <div className="grid grid-cols-2 gap-2">
                                <h1><strong>Giá thuê:</strong> {postDetails.price} triệu/tháng</h1>
                                <h1><strong>Diện tích:</strong> {postDetails.area} m²</h1>
                                <h1><strong>Nội thất:</strong> {postDetails.furnitureStatus}</h1>
                                <h1><strong>Số phòng:</strong> {postDetails.numberOfRooms}</h1>
                                <h1><strong>Giá điện:</strong> {postDetails.electricityPrice} nghìn/kWh</h1>
                                <h1><strong>Giá nước:</strong> {postDetails.waterPrice} nghìn/m³</h1>
                                <h1>
                                    <strong>Địa chỉ:</strong>{" "}
                                    {`${postDetails.houseNumber} ${postDetails.street}, ${postDetails.ward}, ${postDetails.district}, ${postDetails.city}`}
                                </h1>
                            </div>

                            <Separator className="my-1" />

                            {/* Hình ảnh */}
                            <div>
                                <strong>Hình ảnh:</strong>
                                <div className="mt-2 flex gap-2 overflow-x-auto">
                                    {postDetails.postImages.map((image, index) => (
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

                            {/* Chứng nhận */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <strong>Chứng nhận đủ PCCC:</strong>
                                    <div className="mt-2">
                                        {postDetails.licensePcccUrl && postDetails.licensePcccUrl !== "null" ? (
                                            <img
                                                src={postDetails.licensePcccUrl}
                                                alt="Chứng nhận PCCC"
                                                className="w-full h-72 rounded-lg border object-cover shadow cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => setSelectedImage(postDetails.licensePcccUrl)}
                                            />
                                        ) : (
                                            <div className="w-full h-72 rounded-lg border flex items-center justify-center bg-gray-50 text-gray-500">
                                                Không có chứng nhận PCCC
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <strong>Giấy phép kinh doanh:</strong>
                                    <div className="mt-2">
                                        {postDetails.licenseBusinessUrl && postDetails.licenseBusinessUrl !== "null" ? (
                                            <img
                                                src={postDetails.licenseBusinessUrl}
                                                alt="Giấy phép kinh doanh"
                                                className="w-full h-72 rounded-lg border object-cover shadow cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => setSelectedImage(postDetails.licenseBusinessUrl)}
                                            />
                                        ) : (
                                            <div className="w-full h-72 rounded-lg border flex items-center justify-center bg-gray-50 text-gray-500">
                                                Không có giấy phép kinh doanh
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-1" />

                        {/* Nút hành động */}
                        <div className="mt-3 flex justify-end gap-3">
                            {postDetails.status !== "LOCKED" && postDetails.status !== "APPROVED" && postDetails.status !== "REJECTED" && (
                                <>
                                    <Button variant="default" onClick={onApprove} className="bg-gradient-to-r from-primary to-secondary text-white">
                                        Duyệt
                                    </Button>
                                    <Button variant="outline" onClick={onReject} className="text-red-600 border-red-600">
                                        Từ chối
                                    </Button>
                                </>
                            )}
                            <Button variant="outline" onClick={onCancel} className="text-stone-700 border-stone-700">
                                Hủy
                            </Button>
                        </div>

                    </>
                ) : (
                    <p className="text-gray-500">Không có dữ liệu bài viết.</p>
                )}
            </DialogContent>

            {/* Sử dụng component ImagePreviewDialog */}
            <ImagePreviewDialog
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageUrl={selectedImage}
            />
        </Dialog>
    );
};

export default PostDetailsDialog;
