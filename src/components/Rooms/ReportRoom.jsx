import React, { useState } from "react";
import {
    Dialog, DialogTrigger, DialogContent,
    DialogHeader, DialogTitle, DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CiWarning } from "react-icons/ci";
import axiosClient from "@/apis/axiosClient";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import VideoUploader from "../ImageUploader/VideoUploader";

const ReportRoom = ({ roomId }) => {
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [details, setDetails] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // state loading
    const { toast } = useToast();

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);

    const handleCheckboxChange = (reason) => {
        setSelectedReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason]
        );
    };

    const handleSubmit = async () => {
        if (selectedReasons.length === 0 && !details.trim()) {
            toast({
                description: "Vui lòng chọn ít nhất một lý do hoặc nhập ý kiến phản hồi.",
            });
            return;
        }

        setIsLoading(true); // bật loading

        const formData = new FormData();
        formData.append("reason", selectedReasons.join(", "));
        formData.append("details", details);

        images.forEach((imgObj) => {
            formData.append(`images`, imgObj.file);
        });

        if (video) {
            formData.append("video", video.file);
        }
        console.log("Video:", video);

        try {
            const response = await axiosClient.postMultipart(`/reports/create/${roomId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === "success") {
                toast({ description: response.message });
                setIsDialogOpen(false);
                setSelectedReasons([]);
                setDetails("");
                setImages([]);
                setVideo(null);
            } else {
                toast({ description: "Đã có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại." });
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            toast({ description: "Đã có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại." });
        } finally {
            setIsLoading(false); // tắt loading
        }
    };

    const reasons = [
        "Nội dung tin không đúng (giá, diện tích, mô tả, ...)",
        "Địa chỉ của bất động sản không đúng",
        "Ảnh không đúng với thực tế",
        "Không liên lạc được với người bán",
        "Bất động sản đã bán/cho thuê",
        "Tin không có thật",
        "Tin trùng với tin khác",
        "Khác (nhập dưới mô tả):",
    ];

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-base">
                    <CiWarning />
                    Báo vi phạm
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-l font-bold">Báo vi phạm</DialogTitle>
                    <DialogDescription className="text-base text-gray-600">
                        Vui lòng chọn lý do báo cáo vi phạm:
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {reasons.map((reason, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <Checkbox
                                id={`reason-${index}`}
                                onCheckedChange={() => handleCheckboxChange(reason)}
                            />
                            <label
                                htmlFor={`reason-${index}`}
                                className="text-base font-medium text-gray-800"
                            >
                                {reason}
                            </label>
                        </div>
                    ))}

                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">
                            Nhập mô tả:
                        </label>
                        <Textarea
                            placeholder="Nhập mô tả chi tiết..."
                            rows={4}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4">
                        <div className="border-2 border-dashed border-primary/40 rounded-md p-2 flex flex-col justify-center items-center">
                            <p className="text-base font-medium text-gray-700 text-center mb-2">Hình ảnh minh họa (tối đa 3 ảnh):</p>
                            <ImageUploader
                                label="Tải ảnh"
                                maxFiles={3}
                                onImagesChange={(files) => setImages(files)}
                            />
                        </div>

                        <div className="border-2 border-dashed border-primary/40 rounded-md p-2 flex flex-col justify-center items-center">
                            <p className="text-base font-medium text-gray-700 text-center mb-2">Video minh họa (1 video):</p>
                            <VideoUploader
                                label="Tải video"
                                maxFiles={1}
                                onVideoChange={(files) => setVideo(files[0] || null)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button
                        className="text-base"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang gửi..." : "Gửi"}
                    </Button>
                    <Button
                        className="text-base"
                        variant="secondary"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isLoading}
                    >
                        Bỏ qua
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReportRoom;
