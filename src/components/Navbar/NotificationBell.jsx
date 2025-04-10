import React, { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { FaBell } from "react-icons/fa";

// Dữ liệu mock thông báo
const mockNotifications = [
    { id: 1, message: "Bạn có một tin nhắn mới từ chủ trọ.", createdAt: "5 phút trước" },
    { id: 2, message: "Bài đăng của bạn đã được duyệt!", createdAt: "1 giờ trước" },
    { id: 3, message: "Có phòng mới phù hợp với bạn.", createdAt: "Hôm qua" },
];

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    // Giả lập gọi API bằng useEffect
    useEffect(() => {
        if (isPopoverOpen) {
            setTimeout(() => {
                setNotifications(mockNotifications); // Giả lập lấy dữ liệu từ API
            }, 500);
        }
    }, [isPopoverOpen]);

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                <button className="relative p-2">
                    <FaBell className="text-xl" />
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                            {notifications.length}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3">
                <h3 className="text-lg font-semibold">Thông báo</h3>
                <div className="mt-2 max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div key={notif.id} className="p-2 border-b">
                                <p className="text-sm">{notif.message}</p>
                                <span className="text-xs text-gray-500">{notif.createdAt}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">Không có thông báo nào.</p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
