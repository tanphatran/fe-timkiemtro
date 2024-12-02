import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PostDetailsDialog = ({ data, onApprove, onReject, onCancel }) => {
    if (!data) return null;

    return (
        <Dialog open={!!data} onOpenChange={onCancel}>
            <DialogContent isHideClose={true} className="max-w-2xl">
                {/* Tiêu đề */}
                <DialogTitle>{data.title}</DialogTitle>
                <DialogDescription>
                    Xem thông tin chi tiết về bài đăng bên dưới.
                </DialogDescription>

                {/* Nội dung */}
                <div>
                    <p><strong>Mô tả:</strong> {data.description}</p>
                    <p><strong>Giá thuê:</strong> {data.price} triệu/tháng</p>
                    <p><strong>Diện tích:</strong> {data.area} m²</p>
                    <p><strong>Nội thất:</strong> {data.furnitureStatus}</p>
                    <p><strong>Số phòng:</strong> {data.numberOfRooms}</p>
                    <p><strong>Giá điện:</strong> {data.electricityPrice} nghìn/kWh</p>
                    <p><strong>Giá nước:</strong> {data.waterPrice} nghìn/m³</p>
                    <p><strong>Địa chỉ:</strong> {`${data.houseNumber} ${data.street}, ${data.ward}, ${data.district}, ${data.city}`}</p>
                </div>

                {/* Hình ảnh */}
                <div>
                    <strong>Hình ảnh:</strong>
                    <div className="flex gap-2 overflow-auto">
                        {data.postImages.map((image, index) => (
                            <img key={index} src={image} alt={`Hình ảnh ${index + 1}`} className="w-32 h- rounded object-cover" />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <strong>Chứng nhận đủ PCCC:</strong>
                            <div className="flex gap-2 overflow-auto">
                                <img src={data.licensePcccUrl} alt="Chứng nhận PCCC" className="w-24 h-24 rounded object-cover" />
                            </div>
                        </div>
                        <div>
                            <strong>Giấy phép kinh doanh:</strong>
                            <div className="flex gap-2 overflow-auto">
                                <img src={data.licenseBusinessUrl} alt="Chứng nhận PCCC" className="w-24 h-24 rounded object-cover" />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Nút hành động */}
                <div className="mt-6 flex justify-end gap-2">

                    <Button variant="default" onClick={onApprove} className="bg-primary text-white">
                        Duyệt
                    </Button>
                    <Button variant="outline" onClick={onReject} className="text-red-600 border-red-600">
                        Từ chối duyệt
                    </Button>
                    <Button variant="ghost" onClick={onCancel} className="border-black">
                        Hủy
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PostDetailsDialog;
