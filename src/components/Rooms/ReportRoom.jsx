import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"; // Thư viện shadcn ui
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CiWarning } from "react-icons/ci";

const ReportRoom = () => {
    const [selectedReasons, setSelectedReasons] = useState([]);

    const handleCheckboxChange = (reason) => {
        setSelectedReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason]
        );
    };

    const handleSubmit = () => {
        console.log("Reasons:", selectedReasons);
        alert("Báo cáo vi phạm đã được gửi!");
    };

    const reasons = [
        "Nội dung tin không đúng (giá, diện tích, mô tả, ...)",
        "Địa chỉ của bất động sản không đúng",
        "Ảnh không đúng với thực tế",
        "Không liên lạc được với người bán",
        "Bất động sản đã bán/cho thuê",
        "Tin không có thật",
        "Tin trùng với tin khác",
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-base" >
                    <CiWarning />
                    Báo vi phạm</Button>
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
                </div>
                <DialogFooter>
                    <Button className="text-base" onClick={handleSubmit}>Gửi</Button>
                    <Button className="text-base" variant="secondary">Bỏ qua</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReportRoom;
