import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import axiosClient from "@/apis/axiosClient";

export default function VerifyEmail() {
    const [status, setStatus] = useState("loading");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const secretKey = searchParams.get("secretKey");

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await axiosClient.get(`/auth/verify-email`, {
                    params: { secretKey },
                });

                if (response.status === 200 || response.status === "success") {
                    setStatus("success");
                    setTimeout(() => navigate("/"), 2000);
                } else {
                    setStatus("error");
                }
            } catch (err) {
                console.error("Xác minh email thất bại:", err);
                setStatus("error");
            }
        };

        if (secretKey) {
            verify();
        } else {
            setStatus("error");
        }
    }, [secretKey, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            {status === "loading" && (
                <>
                    <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
                    <p className="mt-4">Đang xác minh tài khoản của bạn...</p>
                </>
            )}
            {status === "success" && (
                <>
                    <CheckCircle className="text-green-500 w-16 h-16 mb-2" />
                    <p className="text-xl font-semibold text-green-700">Xác minh thành công!</p>
                    <p className="text-gray-600">Đang chuyển hướng...</p>
                </>
            )}
            {status === "error" && (
                <>
                    <XCircle className="text-red-500 w-16 h-16 mb-2" />
                    <p className="text-xl font-semibold text-red-700">Xác minh thất bại!</p>
                    <p className="text-gray-600">Liên kết không hợp lệ hoặc đã hết hạn.</p>
                </>
            )}
        </div>
    );
}
