import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmDialog = ({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    onConfirm,
    onCancel,
    isLoading = false,
    confirmButtonClassName = "bg-primary hover:bg-primary/80 text-white",
    cancelButtonClassName = "text-stone-700 border-stone-700",
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 justify-end mt-4">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className={cancelButtonClassName}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={confirmButtonClassName}
                    >
                        {isLoading ? "Đang xử lý..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog; 