import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";

export default function VerifyEmail() {
    const [status, setStatus] = useState("loading");
    const navigate = useNavigate();

    useEffect(() => {
        // Giả lập quá trình xác minh
        setTimeout(() => {
            setStatus("success");
            setTimeout(() => {
                navigate("/");
            }, 2000); // Chuyển hướng sau 2s
        }, 1000); // Giả delay xác minh 1s
    }, [navigate]);

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
        </div>
    );
}
