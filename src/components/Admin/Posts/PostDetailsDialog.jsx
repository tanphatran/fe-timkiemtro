import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const PostDetailsDialog = ({ data, onApprove, onReject, onCancel }) => {
    if (!data) return null;

    return (
        <Dialog open={!!data} onOpenChange={onCancel}>
            <DialogContent
                isHideClose={true}
                className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white shadow-lg rounded-lg "
            >
                <DialogTitle className="text-lg font-bold text-red-700">Duyệt bài viết</DialogTitle>
                <p><strong>{data.title}</strong> </p>
                <DialogDescription className="text-sm">
                    {data.description}
                </DialogDescription>

                <Separator className="my-1" />

                <div className="space-y-2">
                    {/* Nội dung chính */}
                    <div className="grid grid-cols-2 gap-2">
                        <h1><strong>Giá thuê:</strong> {data.price} triệu/tháng</h1>
                        <h1><strong>Diện tích:</strong> {data.area} m²</h1>
                        <h1><strong>Nội thất:</strong> {data.furnitureStatus}</h1>
                        <h1><strong>Số phòng:</strong> {data.numberOfRooms}</h1>
                        <h1><strong>Giá điện:</strong> {data.electricityPrice} nghìn/kWh</h1>
                        <h1><strong>Giá nước:</strong> {data.waterPrice} nghìn/m³</h1>
                        <h1><strong>Địa chỉ:</strong> {`${data.houseNumber} ${data.street}, ${data.ward}, ${data.district}, ${data.city}`}</h1>
                    </div>

                    <Separator className="my-1" />

                    {/* Hình ảnh */}
                    <div>
                        <strong>Hình ảnh:</strong>
                        <div className="mt-2 flex gap-2 overflow-x-auto">
                            {data.postImages.map((image, index) => (
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
                                    src={data.licensePcccUrl}
                                    alt="Chứng nhận PCCC"
                                    className="w-full h-24 rounded-lg border object-cover shadow"
                                />
                            </div>
                        </div>
                        <div>
                            <strong>Giấy phép kinh doanh:</strong>
                            <div className="mt-2">
                                <img
                                    src={data.licenseBusinessUrl}
                                    alt="Giấy phép kinh doanh"
                                    className="w-full h-24 rounded-lg border object-cover shadow"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-1" />

                {/* Nút hành động */}
                <div className="mt-3 flex justify-end gap-3">
                    <Button variant="default" onClick={onApprove} className="bg-primary text-white">
                        Duyệt
                    </Button>
                    <Button variant="outline" onClick={onReject} className="text-red-600 border-red-600">
                        Từ chối
                    </Button>
                    <Button variant="ghost" onClick={onCancel}>
                        Hủy
                    </Button>
                </div>
            </DialogContent>


        </Dialog>
    );
};

export default PostDetailsDialog;
