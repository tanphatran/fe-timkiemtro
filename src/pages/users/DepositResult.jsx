import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { XCircle, CheckCircle, ArrowLeftCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DepositResult() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState({ status: "", message: "", postId: null });

    useEffect(() => {
        const query = new URLSearchParams(search);
        const status = query.get("status");
        const message = query.get("message");
        const postId = query.get("postId");
        setResult({
            status: status === "success" ? "success" : "fail",
            message: message || (status === "success"
                ? "Đặt cọc thành công! Vui lòng chờ chủ trọ xác nhận."
                : "Đặt cọc thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ."),
            postId: postId || null,
        });
    }, [search]);

    const handleGoHome = () => {
        navigate("/");
        window.scrollTo(0, 0);
    };

    // Màu chính
    const primary = "#0287a8";
    const successBg = "#e0f7fa"; // xanh nhạt
    const failBg = "#ffeaea";
    const successText = primary;
    const failText = "#e53935";

    return (
        <div className="max-w-lg mx-auto mt-24 mb-10 p-8 rounded-2xl shadow-2xl bg-white border border-gray-200">
            <div className={`flex flex-col items-center text-center ${result.status === "success" ? "border-[" + primary + "]" : "border-red-200"} border-b pb-6 mb-6`}>
                <div
                    className="rounded-full p-3 mb-3"
                    style={{ background: result.status === "success" ? successBg : failBg }}
                >
                    {result.status === "success" ? (
                        <CheckCircle className="h-12 w-12" style={{ color: primary }} />
                    ) : (
                        <XCircle className="h-12 w-12 text-red-500" />
                    )}
                </div>
                <h2
                    className={`text-2xl sm:text-3xl font-bold mb-2`}
                    style={{ color: result.status === "success" ? successText : failText }}
                >
                    {result.status === "success" ? "Đặt cọc thành công" : "Đặt cọc thất bại"}
                </h2>
                <p className="text-base sm:text-lg text-gray-700 mb-2 font-medium">
                    {result.message}
                </p>
                {result.status === "success" && (
                    <p className="text-sm text-gray-500">Vui lòng chờ chủ trọ xác nhận giao dịch. Bạn sẽ nhận được thông báo qua email hoặc trong hệ thống.</p>
                )}
                {result.status === "fail" && (
                    <p className="text-sm text-gray-500">Nếu cần hỗ trợ, vui lòng liên hệ bộ phận CSKH của chúng tôi.</p>
                )}
                {result.postId && result.status === "success" && (
                    <a
                        href={`/roomdetail/${result.postId}`}
                        className="mt-4 inline-flex items-center gap-1 underline text-base font-semibold transition-colors"
                        style={{ color: primary }}
                    >
                        <ExternalLink className="w-4 h-4" style={{ color: primary }} />
                        Xem lại chi tiết phòng vừa đặt cọc
                    </a>
                )}
            </div>
            <div className="mt-6 flex justify-center">
                <Button
                    onClick={handleGoHome}
                    className="px-8 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 text-base font-semibold border-0"
                    style={{
                        background: `linear-gradient(90deg, ${primary} 0%, #4fd1c5 100%)`,
                        color: "#fff"
                    }}
                >
                    <ArrowLeftCircle className="w-5 h-5" style={{ color: "#fff" }} />
                    Quay lại trang chủ
                </Button>
            </div>
        </div>
    );
} 