import React, { useState, useEffect } from "react";
import BannerLogin from "../../assets/banner-login.jpg"; // Đường dẫn banner
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form"; // Form và FormInput giả sử đã tạo trước đó
import { Button } from "../ui/button";
import FormInput from "@/components/forms/FormInput";
import useMeStore from "@/zustand/useMeStore";
import axiosClient from "@/apis/axiosClient";
import { useNavigate } from 'react-router-dom';
import OtpDialog from "./OtpDialog";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
// Định nghĩa schema cho Đăng nhập
const loginSchema = z.object({
    phone: z.string().min(1, { message: "Bạn chưa nhập số điện thoại." }),
    password: z.string(),
});

// Định nghĩa schema cho Đăng ký
const registerSchema = z
    .object({
        fullName: z.string().min(1, { message: "Họ và tên không được để trống." }),
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
    const [isLogin, setIsLogin] = useState(true); // Quản lý trạng thái Đăng nhập/Đăng ký
    const [otpOpen, setOtpOpen] = useState(false);
    const [forgotOpen, setForgotOpen] = useState(false);
    const [registerData, setRegisterData] = useState(null);
    const form = useForm({
        resolver: zodResolver(isLogin ? loginSchema : registerSchema),
        defaultValues: isLogin
            ? { phone: "", password: "" }
            : { fullName: "", phone: "", password: "", confirmPassword: "" },
    });
    // Trước khi sử dụng setToken và setMe, bạn phải lấy chúng từ useMeStore
    const { setRefreshToken, setToken, setMe, role, setRole } = useMeStore();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Role updated:", role);
        if (role === "ADMIN") {
            navigate("/admin");
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
                setRefreshToken(response.data.refreshToken); // Lưu refreshToken
                setMe(response.data.fullName);
                setRole(response.data.userType);
                console.log("Đăng nhập thành công!");
            } else {
                console.error("Đăng nhập thất bại", response.message);
            }
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
        }
    };


    const handleRegister = async (data) => {
        console.log("Dữ liệu gửi đi:", data); // Thêm dòng này để log dữ liệu

        try {
            const response = await axiosClient.post("/auth/register", {
                fullName: data.fullName,
                phoneNumber: data.phone, // Đổi `phone` thành `phoneNumber`
                password: data.password,
            });

            if (response.status === "success") {
                setRegisterData(data);
                setOtpOpen(true);
            } else {
                console.error("Đăng ký thất bại:", response.message);
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
        }
    };

    const handleOtpSubmit = async (otp) => {
        try {
            const response = await axiosClient.post("/auth/verify-otp", {
                otp,
                phoneNumber: registerData.phone,
                fullName: registerData.fullName,
                password: registerData.password,
            });

            setOtpOpen(false);
            setIsLogin(true);
        } catch (error) {
            console.error("Lỗi xác minh OTP:", error);
        }
    };
    return (
        <div className="grid grid-cols-10">
            {/* Banner phần trái */}
            <div className="col-span-4 place-content-center">
                <img src={BannerLogin} alt="Login" className="w-full object-contain" />
            </div>

            {/* Form Đăng nhập / Đăng ký */}
            <div className="col-span-6 p-8">
                <p className="font-bold text-base">Xin chào bạn</p>
                <p className="font-bold text-xl">{isLogin ? "Đăng nhập để tiếp tục" : "Đăng ký tài khoản"}</p>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(isLogin ? handleSubmit : handleRegister)} className="my-4 space-y-4">
                        {!isLogin && (
                            <>
                                {/* Form Đăng ký: Họ và tên */}
                                <FormInput form={form} name="fullName" label="Họ và tên" placeholder="VD: Nguyễn Văn A" />

                            </>
                        )}

                        {/* Form chung cho cả Đăng nhập và Đăng ký: Số điện thoại */}
                        <FormInput form={form} name="phone" label="Số điện thoại" placeholder="VD: 0123456789" />

                        {/* Form chung cho cả Đăng nhập và Đăng ký: Mật khẩu */}
                        <FormInput form={form} name="password" label="Mật khẩu" placeholder="Mật khẩu tối thiểu 6 kí tự" type="password" />

                        {!isLogin && (
                            <>
                                {/* Form Đăng ký: Xác nhận mật khẩu */}
                                <FormInput
                                    form={form}
                                    name="confirmPassword"
                                    label="Xác nhận mật khẩu"
                                    placeholder="Nhập lại mật khẩu"
                                    type="password"
                                />
                            </>
                        )}

                        {/* Nút Submit */}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:bg-bg-gradient-to-r hover:from-secondary hover:bg-primary transition-all duration-600 text-white px-3 py-1"
                        >
                            {isLogin ? "Đăng nhập" : "Đăng ký"}
                        </Button>
                    </form>
                </Form>
                {/* Quên mật khẩu */}
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
                <OtpDialog open={otpOpen} onClose={() => setOtpOpen(false)} onSubmit={handleOtpSubmit} />

                <div className="w-full h-6 flex items-center relative my-4">
                    <div className="w-full h-[1px] bg-stone-200"></div>
                    <p className="absolute inset-0 w-fit mx-auto bg-white text-sm px-2">Hoặc</p>
                </div>

                {/* Đăng nhập bằng Google */}
                <Button className="w-full flex items-center justify-center border border-stone-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-primary hover:bg-white focus:outline-none active:border-primary transition-all duration-300 mt-4">
                    <FcGoogle className="mr-2 text-lg" /> Đăng nhập bằng Google
                </Button>

                {/* Chuyển giữa Đăng nhập và Đăng ký */}
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

        </div>
    );
};

export default Login;
