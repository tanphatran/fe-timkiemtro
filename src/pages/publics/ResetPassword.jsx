import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/apis/axiosClient";
import { useState } from "react";

// Schema validate bằng zod
const resetPasswordSchema = z
    .object({
        password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        confirmPassword: z.string().min(6, "Xác nhận mật khẩu là bắt buộc"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const secretKey = searchParams.get("secretKey");

    const { toast } = useToast();
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            const res = await axiosClient.post("/auth/change-password", {
                secretKey,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });

            if (res.status === "success") {
                setIsSuccess(true);
                toast({
                    title: "Thành công",
                    description: "Mật khẩu của bạn đã được đặt lại.",
                });
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Đặt lại mật khẩu thất bại, vui lòng thử lại.",
            });
        }
    };

    return (
        <div className="container mx-auto p-4 flex justify-center">
            <Card className="w-full max-w-md shadow-lg mt-12">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold">
                        Đặt lại mật khẩu
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormInput
                                form={form}
                                name="password"
                                label="Mật khẩu mới"
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                            />
                            <FormInput
                                form={form}
                                name="confirmPassword"
                                label="Xác nhận mật khẩu"
                                type="password"
                                placeholder="Nhập lại mật khẩu"
                            />
                            <Button type="submit" className="w-full">
                                Đặt lại mật khẩu
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
