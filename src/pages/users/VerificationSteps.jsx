import React, { useState } from "react";
import { Input } from "@/components/ui/input"; // Input của ShadCN UI
import { Button } from "@/components/ui/button"; // Button của ShadCN UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader/ImageUploader";

const VerificationSteps = () => {
    const [currentStep, setCurrentStep] = useState(1); // Bước hiện tại (2: Mã OTP)
    const [otp, setOtp] = useState(""); // Lưu mã OTP
    const [sdt, setSdt] = useState(""); // Lưu mã OTP
    const [cccdImages, setCccdImages] = useState([]);

    // Hàm xử lý khi nhấn nút "Xác thực"
    const handleVerify = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1); // Chuyển sang bước tiếp theo
        } else {
            console.log("Hoàn thành quy trình!");
        }
    };

    return (
        <Card className="max-w-2xl mx-auto p-6">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-center">
                    Xác thực tài khoản
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Phần các bước */}
                <div className="flex justify-center items-center space-x-4 mb-6">
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={
                                "w-10 h-10 rounded-full flex items-center justify-center font-bold " +
                                (currentStep === step
                                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                                    : "bg-gray-200 text-gray-500")
                            }
                        >
                            {step}
                        </div>
                    ))}
                </div>


                {/* Phần nội dung của từng bước */}
                {currentStep === 1 && (
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="otp" className="text-sm font-medium">
                            Nhập số điện thoại
                        </label>
                        <Input
                            id="sft"
                            type="text"
                            placeholder="Nhập số điện thoại"
                            value={sdt}
                            onChange={(e) => setSdt(e.target.value)}
                            maxLength={11}
                            className="text-center border-gray-300 focus-visible:ring focus-visible:ring-secondary"
                        />
                    </div>
                )}
                {currentStep === 2 && (
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="otp" className="text-sm font-medium">
                            Mã OTP*
                        </label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="Nhập mã OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="text-center border-gray-300 focus-visible:ring focus-visible:ring-secondary"
                        />
                    </div>
                )}
                {currentStep === 3 && (
                    <div className="flex flex-col space-y-4 items-center">
                        <label htmlFor="cccd" className=" text-sm font-medium ">Tải ảnh CCCD (Mặt trước và mặt sau)</label>
                        <ImageUploader
                            label="Tải ảnh CCCD"
                            maxFiles={2}  // Cho phép tải lên 2 ảnh
                            minFiles={2}  // Bắt buộc tải ít nhất 2 ảnh
                            onUploadSuccess={(uploadedImages) => setCccdImages(uploadedImages)}  // Lưu ảnh sau khi upload thành công
                        />
                    </div>
                )}
                {currentStep === 4 && (
                    <div className="flex flex-col space-y-4 items-center justify-center">
                        <label className="text-base font-medium ">
                            Cảm ơn bạn đã gửi hồ sơ, chúng tôi sẽ duyệt hồ sơ của bạn sớm nhất !
                        </label>

                    </div>
                )}
                {/* Button Xác thực */}
                <div className="mt-6 text-center">
                    <Button
                        onClick={handleVerify}
                        className="w-full hover:bg-secondary bg-gradient-to-l from-secondary text-white font-medium"
                    >
                        {currentStep < 4 ? "Xác thực" : "Hoàn thành"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default VerificationSteps;
