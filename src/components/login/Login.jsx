import React from 'react'
import BannerLogin from "../../assets/banner-login.jpg";
import { FcGoogle } from 'react-icons/fc';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import FormInput from '@/forms/FormInput';
import { Button } from '../ui/button';

const formSchema = z.object({
    phone: z.string().min(1, { message: "Bạn chưa nhập số điện thoại." }),
    passsword: z.string().min(6, { message: "Mật khẩu tối thiểu 6 kí tự." })
})

const Login = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: "",
            passsword: ""
        }
    })

    return (
        <div className='grid grid-cols-10'>
            <div className='col-span-4 place-content-center' >
                <img src={BannerLogin} alt="Login" className='w-full object-contain' />
            </div>
            <div className='col-span-6 p-8'>
                <p className='font-bold text-base'>Xin chào bạn</p>
                <p className='font-bold text-xl'>Đăng nhập để tiếp tục</p>

                <Form {...form}>
                    <form className='my-4 space-y-4'>
                        <FormInput form={form} name='phone' label="Số điện thoại" placeholder="VD: 0123456789 " />
                        <FormInput form={form} name='password' label="Mật khẩu" placeholder="Mật khẩu tối thiểu 6 kí tự " type='password' />
                        <Button className='w-full bg-gradient-to-r from-primary to-secondary hover:bg-bg-gradient-to-r hover:from-secondary hover:bg-primary transition-all duration-600 text-white px-3 py-1'>
                            Đăng nhập
                        </Button>
                    </form>
                </Form>

                <div className='w-full h-6 flex items-center relative my-4'>
                    <div className='w-full h-[1px] bg-stone-200'></div>
                    <p className='absolute inset-0 w-fit mx-auto bg-white text-sm px-2'>Hoặc</p>
                </div>

                <Button className='w-full flex items-center justify-center border border-stone-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-primary hover:bg-white focus:outline-none active:border-primary transition-all duration-300 mt-4'>
                    <FcGoogle className='mr-2 text-lg' /> Đăng nhập bằng Google
                </Button>

                <p className='text-center text-sm mt-4'>
                    <span>Bạn chưa là thành viên? </span>
                    <span className='text-red-500 font-bold cursor-pointer hover:underline'>Đăng ký</span>
                    <span> tại đây</span>
                </p>
            </div>
        </div>
    )
}

export default Login
