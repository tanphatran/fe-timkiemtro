import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { postPackages } from "@/lib/constants";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/apis/axiosClient";

export default function PostPackage() {
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { toast } = useToast();

    const handleConfirmBuy = async () => {
        const selectedPackage = postPackages[selectedIndex];
        const amount = selectedPackage.amount;

        try {
            setLoading(true);
            const res = await axiosClient.post("/v1/payment/vn-pay", { amount });

            if (res?.data?.paymentUrl) {
                window.location.href = res.data.paymentUrl;
            } else {
                toast({
                    title: "Không thể lấy liên kết thanh toán",
                    description: "Vui lòng thử lại sau.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Lỗi khi gọi API thanh toán:", error);
            toast({
                title: "Thanh toán thất bại",
                description: "Đã xảy ra lỗi. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            setConfirmOpen(false);
        }
    };

    return (
        <div className="py-10 px-4 max-w-6xl mx-auto text-center mt-14">
            <h2 className="text-3xl font-bold mb-6">Chọn gói đăng bài phù hợp với bạn</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {postPackages.map((pkg, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                        <Card
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative border-2 rounded-2xl cursor-pointer transition-all duration-300 
                                ${isSelected
                                    ? "border-primary shadow-lg bg-primary/10"
                                    : "border-gray-200"
                                }`}
                        >
                            {isSelected && (
                                <div className="absolute top-0 right-2 bg-primary text-white text-xs px-2 py-1 rounded-bl-md font-semibold">
                                    Đang chọn
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl">{pkg.title}</CardTitle>
                                <div className="text-3xl font-bold text-primary mt-2">
                                    {pkg.price}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-left mb-4 space-y-2">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="text-green-500 mr-2">✔</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <AlertDialog open={isSelected && confirmOpen} onOpenChange={setConfirmOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            disabled={!isSelected || loading}
                                            className={`w-full text-white transition-all duration-300 
                                                ${isSelected
                                                    ? "bg-primary hover:bg-primary/90"
                                                    : "bg-gray-300 hover:bg-gray-400"
                                                }`}
                                        >
                                            {loading ? "Đang xử lý..." : isSelected ? "Mua ngay" : "Chọn gói"}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Xác nhận thanh toán</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Bạn có chắc chắn muốn mua gói <strong>{pkg.title}</strong> với giá{" "}
                                                <strong>{pkg.price}</strong>?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleConfirmBuy}>Xác nhận</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
