import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";  // Import axios để gửi API request

const ImageUploader = ({
    label = "Upload Image",
    maxFiles = 1,
    minFiles = 1,
    onUploadSuccess // Callback hàm trả về kết quả upload
}) => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);  // Trạng thái uploading
    const [saved, setSaved] = useState(false);  // Trạng thái đã lưu
    const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Kiểm tra số lượng ảnh
        if (selectedFiles.length + images.length > maxFiles) {
            alert(`Bạn chỉ có thể tải tối đa ${maxFiles} ảnh.`);
            return;
        }

        // Tạo URL tạm thời cho các ảnh mới
        const newImages = selectedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages([...images, ...newImages]);
    };

    const uploadImages = async () => {
        if (images.length < minFiles) {
            setErrorMessage(`Vui lòng tải lên ít nhất ${minFiles} ảnh.`);
            return;
        }

        setUploading(true); // Bắt đầu upload
        setErrorMessage(""); // Xóa thông báo lỗi nếu có

        const formData = new FormData();
        images.forEach((image) => {
            formData.append("files", image.file);  // Thêm ảnh vào formData
        });

        try {
            const baseURL = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${baseURL}/post/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.status === "success") {
                alert("Upload thành công!");
                setSaved(true);  // Đánh dấu đã lưu ảnh
                // Gọi callback để truyền thông tin ảnh lên các component khác
                onUploadSuccess(response.data.images);  // Trả về dữ liệu ảnh đã upload
            } else {
                alert("Có lỗi khi tải ảnh lên.");
            }
        } catch (error) {
            console.error("Lỗi khi upload ảnh:", error);
            alert("Có lỗi khi upload ảnh.");
        } finally {
            setUploading(false);  // Kết thúc upload
        }
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(images[index].preview);
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="grid w-full max-w-md items-center gap-3 p-4">
            {/* Tiêu đề */}
            <Label htmlFor="imageUploader" className="text-center text-gray-700 text-sm font-medium">
                {label} ({images.length}/{maxFiles})
            </Label>

            {/* Input file */}
            <Input
                id="imageUploader"
                type="file"
                accept="image/*"
                multiple={maxFiles > 1}
                onChange={handleFileChange}
                className="text-center"
                disabled={uploading || saved}  // Disable input khi đang upload hoặc ảnh đã được lưu
            />

            {/* Hiển thị hình ảnh nhỏ với dấu "X" trước khi lưu, không có dấu "X" sau khi lưu */}
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

            {/* Hiển thị thông báo lỗi nếu chưa đủ ảnh */}
            {errorMessage && (
                <div className="text-red-500 text-center mt-2">{errorMessage}</div>
            )}

            {/* Nút Lưu ảnh */}
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

            {/* Ẩn nút Lưu khi đã upload xong */}
            {uploading && (
                <div className="text-center text-sm text-gray-500 mt-2">Đang tải ảnh lên...</div>
            )}
        </div>
    );
};

export default ImageUploader;
