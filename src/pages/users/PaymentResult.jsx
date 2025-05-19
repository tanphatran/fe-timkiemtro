import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Sử dụng useNavigate thay cho useHistory
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { XCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // Sử dụng Button từ ShadCN UI

export default function PaymentResult() {
    const { search } = useLocation();
    const navigate = useNavigate(); // Quay lại trang chủ sau khi có kết quả thanh toán
    const [result, setResult] = useState({ status: "", message: "" });

    useEffect(() => {
        const query = new URLSearchParams(search);
        const status = query.get("status");
        const message = query.get("message");

        // Cập nhật kết quả thanh toán dựa trên query string
        if (status === "success") {
            setResult({
                status: "success",
                message: message || "Thanh toán thành công! Cảm ơn bạn đã mua gói.",
            });
        } else {
            setResult({
                status: "fail",
                message: message || "Thanh toán thất bại. Giao dịch thanh toán thất bại.",
            });
        }
    }, [search]);

    const handleGoHome = () => {
        navigate("/");
        window.scrollTo(0, 0);
    };

    return (
        <div className="max-w-lg mx-auto mt-24 mb-10 p-8 rounded-lg shadow-lg bg-white">
            <Alert variant={result.status === "success" ? "default" : "destructive"}>
                {result.status === "success" ? (
                    <CheckCircle className="h-7 w-7 text-green-500" />
                ) : (
                    <XCircle className="h-7 w-7 text-red-500" />
                )}
                <div className="ml-4">
                    <AlertTitle className="text-3xl font-semibold text-gray-800">
                        {result.status === "success" ? "Thanh toán thành công" : "Thanh toán thất bại"}
                    </AlertTitle>
                    <AlertDescription className="mt-2 text-lg text-gray-600">
                        {result.message}
                    </AlertDescription>
                </div>
            </Alert>

            <div className="mt-6 flex justify-center">
                <Button
                    onClick={handleGoHome}
                    className="px-8 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-secondary transition duration-300"
                >
                    Quay lại trang chủ
                </Button>
            </div>
        </div>
    );
}
