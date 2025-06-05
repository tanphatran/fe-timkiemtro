import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ImageUploader = ({
    label = "Upload Image",
    maxFiles = 1,
    minFiles = 1,
    onImagesChange, // đổi tên cho rõ ý
}) => {
    const [images, setImages] = useState([]);
    const { toast } = useToast();

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length + images.length > maxFiles) {
            toast({
                title: "Thông báo",
                description: `Bạn chỉ có thể tải tối đa ${maxFiles} ảnh.`,
            });
            return;
        }

        const newImages = selectedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);

        if (onImagesChange) onImagesChange(updatedImages);
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(images[index].preview);
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        if (onImagesChange) onImagesChange(updatedImages);
    };

    return (
        <div className="grid w-full max-w-md items-center gap-3 p-4">
            <Label
                htmlFor="imageUploader"
                className="text-center text-gray-700 text-sm font-medium"
            >
                {label} ({images.length}/{maxFiles})
            </Label>

            <Input
                id="imageUploader"
                type="file"
                accept="image/*"
                multiple={maxFiles > 1}
                onChange={handleFileChange}
                className="text-center"
            />

            <div className="grid grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                    <div key={index} className="relative">
                        <img
                            src={image.preview}
                            alt={`Preview ${index}`}
                            className="w-full h-16 object-cover rounded-md"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;
