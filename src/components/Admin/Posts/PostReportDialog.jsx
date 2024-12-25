import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axiosClient from "@/apis/axiosClient"; // Axios client đã cấu hình

const PostReportDialog = ({ postId, onApprove, onReject, onCancel, onRefresh }) => {
    const [reportDetails, setReportDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch report details từ API
    useEffect(() => {
        if (!postId) return;

        const fetchReportDetails = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.getOne(`/reports/admin/detail/${postId}`);
                setReportDetails(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching report details:", err);
                setError("Không thể tải thông tin chi tiết báo cáo.");
            } finally {
                setLoading(false);
            }
        };

        fetchReportDetails();
    }, [postId]);



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
                ) : reportDetails ? (
                    <>
                        {/* Báo cáo tiêu đề và mô tả */}
                        <p><strong>{reportDetails.title}</strong></p>
                        <DialogDescription className="text-sm">{reportDetails.description}</DialogDescription>

                        <Separator className="my-2" />

                        {/* Nội dung chi tiết */}
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

                            {/* Lý do và chi tiết báo cáo */}
                            <p><strong>Lý do báo cáo:</strong> {reportDetails.reason}</p>
                            <p><strong>Chi tiết báo cáo:</strong> {reportDetails.details}</p>
                        </div>

                        <Separator className="my-4" />

                        {/* Hình ảnh */}
                        <div>
                            <strong>Hình ảnh:</strong>
                            <div className="mt-2 flex gap-2 overflow-x-auto">
                                {reportDetails.postImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Hình ảnh ${index + 1}`}
                                        className="w-32 h-32 rounded-lg border object-cover shadow"
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
                                    <img
                                        src={reportDetails.licensePcccUrl}
                                        alt="Chứng nhận PCCC"
                                        className="w-full h-72 rounded-lg border object-cover shadow"
                                    />
                                </div>
                            </div>
                            <div>
                                <strong>Giấy phép kinh doanh:</strong>
                                <div className="mt-2">
                                    <img
                                        src={reportDetails.licenseBusinessUrl}
                                        alt="Giấy phép kinh doanh"
                                        className="w-full h-72 rounded-lg border object-cover shadow"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Nút hành động */}
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
        </Dialog>
    );
};

export default PostReportDialog;
