import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import VideoUploader from "../ImageUploader/VideoUploader";
import axiosClient from "@/apis/axiosClient";

const ComplaintDialog = ({ open, onOpenChange, depositId, onSuccess, userType = "tenant" }) => {
    const [reason, setReason] = useState("");
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleComplaint = async () => {
        if (!reason.trim()) {
            toast({
                description: "Vui lòng nhập lý do khiếu nại.",
            });
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("reason", reason);

        images.forEach((imgObj) => {
            formData.append(`images`, imgObj.file);
        });

        if (video) {
            formData.append("video", video);
        }

        try {
            const endpoint = userType === "tenant"
                ? `v1/deposit/${depositId}/complaint/tenant`
                : `v1/deposit/${depositId}/complaint/landlord`;

            const response = await axiosClient.postMultipart(endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === "success") {
                toast({ description: response.message });
                onOpenChange(false);
                setReason("");
                setImages([]);
                setVideo(null);
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error) {
            console.error("Error submitting complaint:", error);
            toast({ description: "Đã có lỗi xảy ra khi gửi khiếu nại. Vui lòng thử lại." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-l font-bold">Khiếu nại</DialogTitle>
                    <DialogDescription className="text-base text-gray-600">
                        Vui lòng nhập lý do khiếu nại:
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Textarea
                            placeholder="Nhập lý do khiếu nại..."
                            rows={4}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
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
                                onVideoChange={(file) => setVideo(file || null)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button
                        className="text-base"
                        onClick={handleComplaint}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang gửi..." : "Gửi khiếu nại"}
                    </Button>
                    <Button
                        className="text-base"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ComplaintDialog; 