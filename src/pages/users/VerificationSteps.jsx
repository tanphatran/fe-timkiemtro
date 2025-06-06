import React, { useEffect, useState } from "react";
import axiosClient from "@/apis/axiosClient"; // Import axios client đã có interceptor
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import { useToast } from "@/hooks/use-toast";

const VerificationSteps = () => {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1); // Mặc định là bước 1
    const [verificationStatus, setVerificationStatus] = useState(null); // Trạng thái xác minh
    const [cccdImages, setCccdImages] = useState({
        frontCccd: null,
        backCccd: null,
    });
    const [loading, setLoading] = useState(false);

    // Gọi API để kiểm tra trạng thái xác minh
    useEffect(() => {
        const checkVerificationStatus = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.getOne("/user/landlord-status");
                const status = response.data;

                setVerificationStatus(status);

                // Cập nhật bước dựa trên trạng thái
                if (status === "NOT_REGISTERED") {
                    setCurrentStep(1);
                } else if (status === "PENDING_APPROVAL") {
                    setCurrentStep(3);
                } else if (status === "APPROVED") {
                    setCurrentStep(3);
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra trạng thái xác minh:", error);
            } finally {
                setLoading(false);
            }
        };

        checkVerificationStatus();
    }, []);

    // Hàm xử lý khi ảnh được tải lên thành công
    const handleImageUpload = (type, file) => {
        setCccdImages((prevImages) => ({
            ...prevImages,
            [type]: file,
        }));
    };



    // Hàm gửi dữ liệu đăng ký
    const handleVerify = async () => {
        if (currentStep === 2) {
            if (!cccdImages.frontCccd || !cccdImages.backCccd) {
                toast({
                    title: "Thiếu ảnh CCCD",
                    description: "Vui lòng tải đủ mặt trước và mặt sau của CCCD.",
                    variant: "destructive",
                });
                return;
            }

            setLoading(true);
            try {
                const formData = new FormData();
                formData.append("frontCccd", cccdImages.frontCccd);
                formData.append("backCccd", cccdImages.backCccd);


                await axiosClient.postMultipart(`/user/register-landlord-upload-cccd`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });


                setCurrentStep(3);

                toast({
                    title: "Gửi thành công",
                    description: "Thông tin xác thực đã được gửi, vui lòng đợi duyệt.",
                    variant: "default",
                });
            } catch (error) {
                console.error("Lỗi khi gửi API:", error);
                toast({
                    title: "Lỗi gửi thông tin",
                    description: "Đã xảy ra lỗi khi gửi thông tin xác thực. Vui lòng thử lại!",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        } else if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
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
                <div className="flex justify-center items-center space-x-4 mb-6">
                    {[1, 2, 3].map((step) => (
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

                {/* Nội dung các bước */}
                {currentStep === 1 && verificationStatus === "NOT_REGISTERED" && (
                    <div className="text-center">
                        <p className="text-base font-medium">
                            Tài khoản của bạn cần được xác thực. Hãy nhấn nút{" "}
                            <span className="font-bold text-red-500">"Xác thực"</span> để tiếp tục.
                        </p>
                    </div>
                )}

                {currentStep === 2 && (
                    <div>
                        <label className="text-base font-medium text-center block mb-4">
                            Tải ảnh CCCD
                        </label>
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="border-2 border-dashed border-primary/40 rounded-md p-2 flex justify-center items-center">

                                <ImageUploader
                                    label="Mặt trước CCCD"
                                    maxFiles={1}
                                    onImagesChange={(files) => handleImageUpload("frontCccd", files[0].file)}
                                />
                            </div>
                            <div className="border-2 border-dashed border-primary/40 rounded-md p-2 flex justify-center items-center">
                                <ImageUploader
                                    label="Mặt sau CCCD"
                                    maxFiles={1}
                                    onImagesChange={(files) => handleImageUpload("backCccd", files[0].file)}

                                />

                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="text-center">
                        {verificationStatus === "APPROVED" ? (
                            <p className="text-base font-medium">
                                Bạn đã được phê duyệt, bạn có thể đăng bài ngay bây giờ.
                            </p>
                        ) : (
                            <p className="text-base font-medium">
                                Cảm ơn bạn đã gửi hồ sơ, chúng tôi sẽ duyệt hồ sơ của bạn sớm nhất!
                            </p>
                        )}
                    </div>
                )}



                {/* Nút Xác Thực */}
                <div className="mt-6 text-center">
                    <Button
                        onClick={handleVerify}
                        disabled={loading}
                        className="w-full hover:bg-secondary bg-gradient-to-l from-secondary text-white font-medium"
                    >
                        {loading
                            ? "Đang gửi..."
                            : currentStep < 3
                                ? "Xác thực"
                                : "Hoàn thành"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default VerificationSteps;
