import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const VideoUploader = ({
    label = "Upload Video",
    maxFiles = 1,  // video thì chỉ 1 thôi
    onVideoChange, // callback trả về file video hoặc null nếu xoá
}) => {
    const [video, setVideo] = useState(null);
    const { toast } = useToast();

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length > maxFiles) {
            toast({
                title: "Thông báo",
                description: `Bạn chỉ có thể tải tối đa ${maxFiles} video.`,
            });
            return;
        }

        const file = selectedFiles[0];
        if (!file.type.startsWith("video/")) {
            toast({
                title: "Định dạng không hợp lệ",
                description: "Vui lòng chọn file video hợp lệ.",
            });
            return;
        }

        const videoWithPreview = {
            file,
            preview: URL.createObjectURL(file),
        };

        setVideo(videoWithPreview);
        if (onVideoChange) onVideoChange(file);
    };

    const removeVideo = () => {
        if (video) {
            URL.revokeObjectURL(video.preview);
            setVideo(null);
            if (onVideoChange) onVideoChange(null);
        }
    };

    return (
        <div className="grid w-full max-w-md items-center gap-3 p-4">
            <Label
                htmlFor="videoUploader"
                className="text-center text-gray-700 text-sm font-medium"
            >
                {label} {video ? "(1/1)" : "(0/1)"}
            </Label>

            <Input
                id="videoUploader"
                type="file"
                accept="video/*"
                multiple={false}
                onChange={handleFileChange}
                className="text-center"
            />

            {video && (
                <div className="relative mt-4">
                    <video
                        src={video.preview}
                        controls
                        className="w-full max-h-48 rounded-md"
                    />
                    <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-1 right-1 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoUploader;
