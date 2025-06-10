import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axiosClient from "@/apis/axiosClient"; // Axios client đã cấu hình
import ImagePreviewDialog from "@/components/ImagePreview/ImagePreviewDialog";

const PostReportDialog = ({ postId, reportId, onApprove, onReject, onCancel, onRefresh }) => {
    const [reportDetails, setReportDetails] = useState(null);
    const [reportInfo, setReportInfo] = useState(null); // Thêm state cho thông tin báo cáo
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (!postId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Lấy thông tin bài viết
                const postRes = await axiosClient.getOne(`/post/admin/detail/${postId}`);
                setReportDetails(postRes.data);

                // Lấy thông tin báo cáo
                const reportRes = await axiosClient.getOne(`/reports/admin/detail/${reportId}`);
                setReportInfo(reportRes.data);
                console.log("Video URL:", reportInfo.videoUrl);

                setError(null);
            } catch (err) {
                console.error("Error fetching details:", err);
                setError("Không thể tải thông tin chi tiết.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [postId, reportId]);

    if (!postId) return null;

    return (
        <Dialog open={!!postId} onOpenChange={onCancel}>
            <DialogContent
                isHideClose={true}
                className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white shadow-lg rounded-lg"
            >
                <DialogTitle className="text-lg font-bold text-red-700">Chi tiết báo cáo</DialogTitle>
                {loading ? (
                    <p>Đang tải...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : reportDetails && reportInfo ? (
                    <>
                        <p><strong>{reportDetails.title}</strong></p>
                        <DialogDescription className="text-sm">{reportDetails.description}</DialogDescription>

                        <Separator className="my-2" />

                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <p><strong>Giá thuê:</strong> {reportDetails.price} VNĐ/tháng</p>
                                <p><strong>Diện tích:</strong> {reportDetails.area} m²</p>
                                <p><strong>Số phòng:</strong> {reportDetails.numberOfRooms}</p>
                                <p><strong>Giá điện:</strong> {reportDetails.electricityPrice} VNĐ/kWh</p>
                                <p><strong>Giá nước:</strong> {reportDetails.waterPrice} VNĐ/m³</p>
                                <p>
                                    <strong>Địa chỉ:</strong>{" "}
                                    {`${reportDetails.houseNumber} ${reportDetails.street}, ${reportDetails.ward}, ${reportDetails.district}, ${reportDetails.city}`}
                                </p>
                            </div>

                            <Separator className="my-2" />

                            {/* Thông tin báo cáo */}
                            <p><strong>Lý do báo cáo:</strong> {reportInfo.reason}</p>
                            <p><strong>Chi tiết báo cáo:</strong> {reportInfo.details}</p>
                            <p className="text-sm text-muted-foreground">
                                <strong>Ngày báo cáo:</strong>{" "}
                                {new Date(reportInfo.createdAt).toLocaleString("vi-VN")}
                            </p>
                        </div>

                        <Separator className="my-4" />

                        {/* Hình ảnh bài viết */}
                        <div>
                            <strong>Hình ảnh bài viết:</strong>
                            <div className="mt-2 flex gap-2 overflow-x-auto">
                                {reportDetails.postImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Hình ảnh bài viết ${index + 1}`}
                                        className="w-32 h-32 rounded-lg border object-cover shadow cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => setSelectedImage(image)}
                                    />
                                ))}
                            </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Hình ảnh báo cáo */}
                        {reportInfo.reportImages && reportInfo.reportImages.length > 0 && (
                            <div>
                                <strong>Hình ảnh báo cáo:</strong>
                                <div className="mt-2 flex gap-2 overflow-x-auto">
                                    {reportInfo.reportImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Hình ảnh báo cáo ${index + 1}`}
                                            className="w-32 h-32 rounded-lg border object-cover shadow cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => setSelectedImage(image)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator className="my-4" />

                        {/* Video báo cáo */}
                        {reportInfo.videoUrl && (
                            <div>
                                <strong>Video báo cáo:</strong>
                                <div className="mt-2">
                                    <video
                                        controls
                                        src={reportInfo.videoUrl}
                                        className="w-full max-h-96 rounded-lg border shadow"
                                    />
                                </div>
                            </div>
                        )}

                        <Separator className="my-4" />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong>Chứng nhận đủ PCCC:</strong>
                                <div className="mt-2">
                                    {reportDetails.licensePcccUrl && reportDetails.licensePcccUrl !== "null" ? (
                                        <img
                                            src={reportDetails.licensePcccUrl}
                                            alt="Chứng nhận PCCC"
                                            className="w-full h-72 rounded-lg border object-cover shadow cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => setSelectedImage(reportDetails.licensePcccUrl)}
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
                                    {reportDetails.licenseBusinessUrl && reportDetails.licenseBusinessUrl !== "null" ? (
                                        <img
                                            src={reportDetails.licenseBusinessUrl}
                                            alt="Giấy phép kinh doanh"
                                            className="w-full h-72 rounded-lg border object-cover shadow cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => setSelectedImage(reportDetails.licenseBusinessUrl)}
                                        />
                                    ) : (
                                        <div className="w-full h-72 rounded-lg border flex items-center justify-center bg-gray-50 text-gray-500">
                                            Không có giấy phép kinh doanh
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="mt-3 flex justify-end gap-3">
                            <Button variant="default" onClick={onApprove} className="bg-primary text-white">
                                Duyệt bài
                            </Button>
                            <Button variant="outline" onClick={onReject} className="text-red-600 border-red-600">
                                Từ chối
                            </Button>
                            <Button variant="ghost" onClick={onCancel} className="border border-black text-black">
                                Hủy
                            </Button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500">Không có dữ liệu báo cáo.</p>
                )}
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

export default PostReportDialog;
