import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CiWarning } from "react-icons/ci";
import axiosClient from "@/apis/axiosClient";
import { useToast } from "@/hooks/use-toast";

const ReportRoom = ({ roomId }) => {
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [details, setDetails] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

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

        const payload = {
            reason: selectedReasons.join(", "),
            details: details,
        };

        try {
            const response = await axiosClient.post(`/reports/create/${roomId}`, payload);

            if (response.status === "success") {
                toast({ description: response.message });
                setIsDialogOpen(false);
            } else {
                toast({ description: "Đã có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại." });
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            toast({ description: "Đã có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại." });
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
            <DialogContent>
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
                    <div className="mb-6">
                        <label className="block text-base font-medium text-gray-700 mb-2">
                            Nhập mô tả:
                        </label>
                        <Textarea
                            placeholder="Nhập mô tả chi tiết..."
                            rows={5}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button className="text-base" onClick={handleSubmit}>
                        Gửi
                    </Button>
                    <Button
                        className="text-base"
                        variant="secondary"
                        onClick={() => setIsDialogOpen(false)}
                    >
                        Bỏ qua
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReportRoom;