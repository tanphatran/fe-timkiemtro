import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

const OtpDialog = ({ open, onClose, onSubmit }) => {
    const { register, handleSubmit } = useForm();

    const handleOtpSubmit = (data) => {
        onSubmit(data.otp);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className=" max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex justify-center">Nhập OTP để tiếp tục</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleOtpSubmit)} className="flex flex-col items-center justify-center">
                    <Input
                        {...register("otp", { required: "Mã OTP không được để trống" })}
                        placeholder="Nhập mã OTP"
                        maxLength={6}
                        className="mb-4 w-40 flex text-center"
                    />
                    <DialogFooter>
                        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:bg-bg-gradient-to-r hover:from-secondary hover:bg-primary transition-all duration-600 text-white">
                            Xác nhận
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default OtpDialog;
