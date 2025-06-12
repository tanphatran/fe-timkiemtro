import React, { useEffect, useState } from "react";
import axiosClient from "@/apis/axiosClient"; // Import axios client đã có interceptor
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import useMeStore from "@/zustand/useMeStore";
import axios from "axios";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const FPT_API_KEY = import.meta.env.VITE_FPT_API_KEY;

const VerificationSteps = () => {
    const { toast } = useToast();
    const role = useMeStore((state) => state.role);
    const setRole = useMeStore((state) => state.setRole);
    const [currentStep, setCurrentStep] = useState(1); // Mặc định là bước 1
    const [verificationStatus, setVerificationStatus] = useState(null); // Trạng thái xác minh
    const [cccdImages, setCccdImages] = useState({
        frontCccd: null,
        backCccd: null,
    });
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState({ front: null, back: null });
    const [scanning, setScanning] = useState(false);
    const [editableCCCD, setEditableCCCD] = useState({
        id: "",
        name: "",
        dob: "",
        sex: "",
        nationality: "",
        home: "",
        address: "",
        doe: "",
        features: "",
        issue_date: "",
    });

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
                    setCurrentStep(4);
                } else if (status === "APPROVED") {
                    setCurrentStep(4);
                    // Nếu đã được duyệt và role chưa phải LANDLORD thì cập nhật role
                    if (role !== "LANDLORD") {
                        setRole("LANDLORD");
                    }
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra trạng thái xác minh:", error);
            } finally {
                setLoading(false);
            }
        };

        checkVerificationStatus();
    }, [role, setRole]);

    // Hàm xử lý khi ảnh được tải lên thành công
    const handleImageUpload = (type, file) => {
        setCccdImages((prevImages) => ({
            ...prevImages,
            [type]: file,
        }));
    };

    // Hàm scan CCCD qua FPT.AI
    const scanCCCD = async (file, side) => {
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await axios.post(
                'https://api.fpt.ai/vision/idr/vnm/',
                formData,
                {
                    headers: {
                        "api_key": FPT_API_KEY,
                        // Không cần Content-Type, axios sẽ tự set
                    },
                }
            );
            const data = response.data;
            if (data.errorCode === 0 && data.data && data.data.length > 0) {
                setScanResult((prev) => ({ ...prev, [side]: data.data[0] }));
            } else {
                setScanResult((prev) => ({ ...prev, [side]: null }));
            }
        } catch (err) {
            setScanResult((prev) => ({ ...prev, [side]: null }));
        }
    };

    // Khi scan xong, gán dữ liệu vào editableCCCD
    useEffect(() => {
        if (currentStep === 3 && scanResult.front) {
            setEditableCCCD((prev) => ({
                ...prev,
                id: scanResult.front.id || "",
                name: scanResult.front.name || "",
                dob: scanResult.front.dob || "",
                sex: scanResult.front.sex || "",
                nationality: scanResult.front.nationality || "",
                home: scanResult.front.home || "",
                address: scanResult.front.address || "",
                doe: scanResult.front.doe || "",
            }));
        }
        if (currentStep === 3 && scanResult.back) {
            setEditableCCCD((prev) => ({
                ...prev,
                features: scanResult.back.features || "",
                issue_date: scanResult.back.issue_date || "",
            }));
        }
    }, [currentStep, scanResult.front, scanResult.back]);

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
            // Khi bấm tiếp tục mới scan CCCD
            setScanning(true);
            await Promise.all([
                scanCCCD(cccdImages.frontCccd, "front"),
                scanCCCD(cccdImages.backCccd, "back"),
            ]);
            setScanning(false);
            setCurrentStep(3);
            return;
        } else if (currentStep === 3) {
            // Bước xác nhận thông tin, nếu đồng ý thì gửi xác thực
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append("frontCccd", cccdImages.frontCccd);
                formData.append("backCccd", cccdImages.backCccd);
                formData.append("fullName", editableCCCD.name);
                formData.append("dateOfBirth", editableCCCD.dob);
                formData.append("address", editableCCCD.address);
                formData.append("cccdNumber", editableCCCD.id);
                formData.append("gender", editableCCCD.sex);
                formData.append("nationality", editableCCCD.nationality);
                formData.append("hometown", editableCCCD.home);
                formData.append("cccdIssueDate", editableCCCD.issue_date);
                await axiosClient.postMultipart(`/user/register-landlord-upload-cccd`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setCurrentStep(4);
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
        } else if (currentStep < 4) {
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

                {/* Nội dung các bước */}
                {currentStep === 1 && (
                    <div className="text-center">
                        {verificationStatus === "NOT_REGISTERED" && (
                            <p className="text-base font-medium">
                                Tài khoản của bạn cần được xác thực. Hãy nhấn nút{" "}
                                <span className="font-bold text-red-500">"Xác thực"</span> để tiếp tục.
                            </p>
                        )}

                        {verificationStatus === "REJECTED" && (
                            <div>
                                <p className="text-base font-medium text-red-600">
                                    Hồ sơ xác thực của bạn đã bị từ chối. Vui lòng liên hệ quản trị viên hoặc thử lại sau.
                                </p>
                            </div>
                        )}
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
                    <div className="p-2">
                        <h3 className="font-semibold mb-2 text-center">Xác nhận thông tin CCCD</h3>
                        {scanning ? (
                            <div className="text-center text-blue-500">Đang nhận diện thông tin từ ảnh...</div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <div className="mb-2">
                                        <label htmlFor="id" className="block text-sm font-medium text-gray-700">Số CCCD</label>
                                        <Input id="id" value={editableCCCD.id} onChange={e => setEditableCCCD(prev => ({ ...prev, id: e.target.value }))} placeholder="Số CCCD" />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                                        <Input id="name" value={editableCCCD.name} onChange={e => setEditableCCCD(prev => ({ ...prev, name: e.target.value }))} placeholder="Họ và tên" />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                                        <Input id="dob" value={editableCCCD.dob} onChange={e => setEditableCCCD(prev => ({ ...prev, dob: e.target.value }))} placeholder="Ngày sinh" />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Giới tính</label>
                                        <Select
                                            value={editableCCCD.sex}
                                            onValueChange={value => setEditableCCCD(prev => ({ ...prev, sex: value }))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn giới tính" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NAM">NAM</SelectItem>
                                                <SelectItem value="NỮ">NỮ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Quốc tịch</label>
                                        <Input id="nationality" value={editableCCCD.nationality} onChange={e => setEditableCCCD(prev => ({ ...prev, nationality: e.target.value }))} placeholder="Quốc tịch" />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="home" className="block text-sm font-medium text-gray-700">Nguyên quán</label>
                                        <Input id="home" value={editableCCCD.home} onChange={e => setEditableCCCD(prev => ({ ...prev, home: e.target.value }))} placeholder="Nguyên quán" />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                        <Input id="address" value={editableCCCD.address} onChange={e => setEditableCCCD(prev => ({ ...prev, address: e.target.value }))} placeholder="Địa chỉ" />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700">Ngày cấp</label>
                                        <Input id="issue_date" value={editableCCCD.issue_date} onChange={e => setEditableCCCD(prev => ({ ...prev, issue_date: e.target.value }))} placeholder="Ngày cấp" />
                                    </div>
                                </div>
                                <div className="text-center mt-3">
                                    <span className="text-xs text-gray-500">Vui lòng kiểm tra và chỉnh sửa thông tin trước khi gửi xác thực.</span>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {currentStep === 4 && (
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
                        disabled={loading || verificationStatus === "REJECTED" || scanning}
                        className="w-full hover:bg-secondary bg-gradient-to-l from-secondary text-white font-medium"
                    >
                        {loading
                            ? "Đang gửi..."
                            : verificationStatus === "REJECTED"
                                ? "Đã bị từ chối"
                                : currentStep === 2
                                    ? (scanning ? "Đang nhận diện..." : "Tiếp tục")
                                    : currentStep === 3
                                        ? "Xác nhận & Gửi xác thực"
                                        : currentStep < 4
                                            ? "Xác thực"
                                            : "Hoàn thành"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default VerificationSteps;
