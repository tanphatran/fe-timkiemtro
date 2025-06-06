import React, { useState, useEffect } from "react";
import BannerLogin from "../../assets/banner-login.jpg";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import FormInput from "@/components/forms/FormInput";
import useMeStore from "@/zustand/useMeStore";
import axiosClient from "@/apis/axiosClient";
import { useNavigate } from "react-router-dom";
import OtpDialog from "./OtpDialog";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Schema đăng nhập
const loginSchema = z.object({
    phone: z.string().min(1, { message: "Bạn chưa nhập số điện thoại." }),
    password: z.string(),
});

// Schema đăng ký
const registerSchema = z
    .object({
        fullName: z.string().min(1, { message: "Họ và tên không được để trống." }),
        email: z.string().email({ message: "Email không hợp lệ." }),
        phone: z
            .string()
            .min(10, { message: "Số điện thoại phải có ít nhất 10 chữ số." })
            .regex(/^\d+$/, { message: "Số điện thoại chỉ bao gồm chữ số." }),
        password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 kí tự." }),
        confirmPassword: z.string().min(6, { message: "Mật khẩu xác nhận tối thiểu 6 kí tự." }),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                path: ["confirmPassword"],
                message: "Mật khẩu xác nhận không khớp.",
            });
        }
    });

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [otpOpen, setOtpOpen] = useState(false);
    const [forgotOpen, setForgotOpen] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [registerData, setRegisterData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(isLogin ? loginSchema : registerSchema),
        defaultValues: isLogin
            ? { phone: "", password: "" }
            : { fullName: "", email: "", phone: "", password: "", confirmPassword: "" },
    });

    const { setRefreshToken, setToken, setMe, role, setRole, setId } = useMeStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (role === "ADMIN") {
            navigate("/admin/dashboard");
        }
    }, [role, navigate]);

    const handleSubmit = async (data) => {
        try {
            const response = await axiosClient.post("/auth/login", {
                phoneNumber: data.phone,
                password: data.password,
            });

            if (response.status === "success") {
                setToken(response.data.accessToken);
                setRefreshToken(response.data.refreshToken);
                setMe(response.data.fullName);
                setRole(response.data.userType);
                setId(response.data.userId);
            } else {
                form.setError("phone", {
                    type: "manual",
                    message: "Số điện thoại hoặc mật khẩu không đúng.",
                });
                form.setError("password", {
                    type: "manual",
                    message: " ",
                });
            }
        } catch (error) {
            form.setError("phone", {
                type: "manual",
                message: "Số điện thoại hoặc mật khẩu không đúng.",
            });
            form.setError("password", {
                type: "manual",
                message: " ",
            });
            console.error("Lỗi khi đăng nhập:", error);
        }
    };

    const handleRegister = async (data) => {
        setIsSubmitting(true); // Bắt đầu loading
        try {
            const response = await axiosClient.post("/auth/register", {
                fullName: data.fullName,
                email: data.email,
                phoneNumber: data.phone,
                password: data.password,
            });

            if (response?.status === 200 || response?.status === "success") {
                setSuccessDialogOpen(true);
            } else {
                form.setError("phone", {
                    type: "manual",
                    message: response?.data?.message || "Đăng ký thất bại",
                });
            }
        } catch (error) {
            form.setError("phone", {
                type: "manual",
                message: error?.response?.data?.message || "Lỗi khi đăng ký",
            });
            console.error("Lỗi đăng ký:", error);
        } finally {
            setIsSubmitting(false); // Kết thúc loading
        }
    };


    return (
        <div className="grid grid-cols-10">
            {/* Banner trái */}
            <div className="col-span-4 place-content-center">
                <img src={BannerLogin} alt="Login" className="w-full object-contain" />
            </div>

            {/* Form */}
            <div className="col-span-6 p-8">
                <p className="font-bold text-base">Xin chào bạn</p>
                <p className="font-bold text-xl">{isLogin ? "Đăng nhập để tiếp tục" : "Đăng ký tài khoản"}</p>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(isLogin ? handleSubmit : handleRegister)}
                        className="my-4 space-y-4"
                    >
                        {!isLogin && (
                            <>
                                <FormInput form={form} name="fullName" label="Họ và tên" placeholder="VD: Nguyễn Văn A" />
                                <FormInput form={form} name="email" label="Email" placeholder="VD: example@gmail.com" />
                            </>
                        )}

                        <FormInput form={form} name="phone" label="Số điện thoại" placeholder="VD: 0123456789" />
                        <FormInput form={form} name="password" label="Mật khẩu" placeholder="Tối thiểu 6 ký tự" type="password" />

                        {!isLogin && (
                            <FormInput
                                form={form}
                                name="confirmPassword"
                                label="Xác nhận mật khẩu"
                                placeholder="Nhập lại mật khẩu"
                                type="password"
                            />
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-3 py-1 transition-all duration-300"
                        >
                            {isSubmitting ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
                        </Button>

                    </form>
                </Form>

                {isLogin && (
                    <p className="text-right text-sm mt-2">
                        <span
                            className="text-red-500 font-bold cursor-pointer hover:underline"
                            onClick={() => setForgotOpen(true)}
                        >
                            Quên mật khẩu?
                        </span>
                    </p>
                )}

                <OtpDialog open={otpOpen} onClose={() => setOtpOpen(false)} onSubmit={() => { }} />

                <div className="w-full h-6 flex items-center relative my-4">
                    <div className="w-full h-[1px] bg-stone-200"></div>
                    <p className="absolute inset-0 w-fit mx-auto bg-white text-sm px-2">Hoặc</p>
                </div>

                <Button className="w-full flex items-center justify-center border border-stone-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-primary hover:bg-white transition-all duration-300 mt-4">
                    <FcGoogle className="mr-2 text-lg" /> Đăng nhập bằng Google
                </Button>

                <p className="text-center text-sm mt-4">
                    {isLogin ? (
                        <>
                            <span>Bạn chưa có tài khoản? </span>
                            <span
                                className="text-red-500 font-bold cursor-pointer hover:underline"
                                onClick={() => setIsLogin(false)}
                            >
                                Đăng ký
                            </span>
                            <span> tại đây</span>
                        </>
                    ) : (
                        <>
                            <span>Bạn đã có tài khoản? </span>
                            <span
                                className="text-red-500 font-bold cursor-pointer hover:underline"
                                onClick={() => setIsLogin(true)}
                            >
                                Đăng nhập
                            </span>
                            <span> tại đây</span>
                        </>
                    )}
                </p>
            </div>

            <ForgotPasswordDialog open={forgotOpen} onClose={() => setForgotOpen(false)} />

            {/* ✅ Dialog thông báo đăng ký thành công */}
            <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Đăng ký thành công</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hệ thống đã gửi một liên kết xác nhận đến email của bạn. Vui lòng kiểm tra hộp thư đến (hoặc thư rác).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => {
                                setSuccessDialogOpen(false);
                                setIsLogin(true);
                            }}
                        >
                            Đăng nhập ngay
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Login;
