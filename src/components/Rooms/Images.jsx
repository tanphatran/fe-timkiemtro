import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

const Images = ({ images = [] }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="w-full relative grid grid-cols-4 gap-2">
            {/* Ảnh lớn */}
            <img
                src={images[0]}
                alt="picture-1"
                className="w-full h-[392px] col-span-2 row-span-2 rounded-l-md object-cover"
            />
            {/* Các ảnh nhỏ */}
            {images.slice(1, 5).map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`picture-${index + 2}`}
                    className={`w-full h-48 object-cover ${index === 1
                        ? "rounded-tr-md"
                        : index === 3
                            ? "rounded-br-md"
                            : ""
                        }`}
                />
            ))}

            {/* Nút hiển thị tất cả ảnh */}
            <div className="absolute bottom-3 right-3">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-primary/50">Hiển thị tất cả ảnh</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] p-4 flex flex-col items-center">
                        {/* Ảnh chính */}
                        <div className="mb-4">
                            <img
                                src={selectedImage}
                                alt="selected"
                                className="h-[500px] object-cover rounded-md"
                            />
                        </div>

                        {/* Danh sách ảnh nhỏ */}
                        <div className="flex gap-2 overflow-x-auto">
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`image-${index}`}
                                    className={`w-24 h-24 object-cover rounded-md cursor-pointer ${image === selectedImage
                                        ? "border-2 border-primary"
                                        : ""
                                        }`}
                                    onClick={() => setSelectedImage(image)}
                                />
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Images;
