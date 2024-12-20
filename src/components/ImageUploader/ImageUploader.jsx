import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const ImageUploader = ({
    label = "Upload Image",
    maxFiles = 1,
    minFiles = 1,
    onUploadSuccess,
}) => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { toast } = useToast();

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length + images.length > maxFiles) {
            toast({
                title: "Thông báo",
                description: `Bạn chỉ có thể tải tối đa ${maxFiles} ảnh.`,

            })
            return;
        }

        const newImages = selectedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages([...images, ...newImages]);
    };

    const uploadImages = async () => {
        if (images.length < minFiles) {
            toast({
                title: "Thông báo",
                description: `Vui lòng tải lên ít nhất ${minFiles} ảnh.`,

            })
            return;
        }

        setUploading(true);
        setErrorMessage("");

        const formData = new FormData();
        images.forEach((image) => {
            formData.append("files", image.file);
        });

        try {
            const baseURL = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${baseURL}/post/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (response.data && response.data.status === "success") {
                toast({
                    description: "Upload thành công!",

                })
                setSaved(true);
                const uploadedImages = response.data.data;
                if (onUploadSuccess) onUploadSuccess(uploadedImages);
            } else {
                toast({
                    description: "Có lỗi khi tải ảnh lên.!",

                })
            }
        } catch (error) {
            console.error("Lỗi khi upload ảnh:", error);

            toast({ description: "Có lỗi khi upload ảnh." });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(images[index].preview);
        setImages(images.filter((_, i) => i !== index));
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
                disabled={uploading || saved}
            />

            <div className="grid grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                    <div key={index} className="relative">
                        <img
                            src={image.preview}
                            alt={`Preview ${index}`}
                            className="w-full h-16 object-cover rounded-md"
                        />
                        {!saved && (
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {errorMessage && (
                <div className="text-red-500 text-center mt-2">{errorMessage}</div>
            )}

            <div className="mt-4 text-center">
                {!uploading && images.length > 0 && !saved && (
                    <button
                        onClick={uploadImages}
                        className="px-4 py-2 bg-primary text-white rounded-md"
                        disabled={uploading}
                    >
                        {uploading ? "Đang tải..." : "Xác nhận tải lên"}
                    </button>
                )}
            </div>

            {uploading && (
                <div className="text-center text-sm text-gray-500 mt-2">
                    Đang tải ảnh lên...
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
