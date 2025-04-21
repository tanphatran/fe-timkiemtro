import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../forms/FormInput";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/apis/axiosClient";

const forgotSchema = z.object({
    email: z.string().email({ message: "Email không hợp lệ." }),
});

const ForgotPasswordDialog = ({ open, onClose }) => {
    const form = useForm({
        resolver: zodResolver(forgotSchema),
        defaultValues: {
            email: "",
        },
    });

    const { toast } = useToast();

    const handleSend = async (data) => {
        try {
            const res = await axiosClient.post("/auth/forgot-password", {
                email: data.email,
            });

            if (res.status === "success") {
                toast({
                    title: "Thành công",
                    description: "Liên kết đặt lại mật khẩu đã được gửi qua email.",
                });
                onClose();
            } else {
                toast({
                    title: "Lỗi",
                    description: res.data.message || "Gửi email thất bại",
                });
            }
        } catch (err) {
            toast({
                title: "Lỗi hệ thống",
                description: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
            });
            console.error("Lỗi gửi email:", err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Quên mật khẩu</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSend)} className="space-y-4 mt-4">
                        <FormInput
                            form={form}
                            name="email"
                            label="Email"
                            placeholder="Nhập email bạn đã đăng ký"
                        />
                        <Button type="submit" className="w-full bg-primary text-white">
                            Gửi liên kết đặt lại mật khẩu
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPasswordDialog;
