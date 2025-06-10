import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const ImagePreviewDialog = ({ isOpen, onClose, imageUrl }) => {
    if (!imageUrl) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent isHideClose={true} className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-none">
                <VisuallyHidden>
                    <DialogTitle>Xem ảnh</DialogTitle>
                </VisuallyHidden>
                <div className="relative">
                    <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-auto max-h-[80vh] object-contain"
                    />
                    <Button
                        variant="ghost"
                        className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                        onClick={onClose}
                    >
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImagePreviewDialog; 