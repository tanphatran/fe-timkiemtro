import React, { useState } from "react";
import BannerLogin from "../../assets/banner-login.jpg"; // Đường dẫn banner
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form"; // Form và FormInput giả sử đã tạo trước đó
import { Button } from "../ui/button";
import FormInput from "@/components/forms/FormInput";
// Định nghĩa schema cho Đăng nhập
const loginSchema = z.object({
    phone: z.string().min(1, { message: "Bạn chưa nhập số điện thoại." }),
    password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 kí tự." }),
});

// Định nghĩa schema cho Đăng ký
const registerSchema = z.object({
    fullName: z.string().min(1, { message: "Họ và tên không được để trống." }),
    phone: z
        .string()
        .min(10, { message: "Số điện thoại phải có ít nhất 10 chữ số." })
        .regex(/^\d+$/, { message: "Số điện thoại chỉ bao gồm chữ số." }),
    password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 kí tự." }),
    confirmPassword: z
        .string()
        .min(6, { message: "Mật khẩu xác nhận tối thiểu 6 kí tự." })
        .refine((value, ctx) => value === ctx.parent.password, { message: "Mật khẩu xác nhận không khớp." }),
});

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // Quản lý trạng thái Đăng nhập/Đăng ký
    const form = useForm({
        resolver: zodResolver(isLogin ? loginSchema : registerSchema),
        defaultValues: isLogin
            ? { phone: "", password: "" }
            : { fullName: "", phone: "", password: "", confirmPassword: "" },
    });

    const handleSubmit = (data) => {
        console.log(isLogin ? "Login Data:" : "Register Data:", data);
        // Logic xử lý Đăng nhập hoặc Đăng ký
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
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="my-4 space-y-4">
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
        </div>
    );
};

export default Login;
