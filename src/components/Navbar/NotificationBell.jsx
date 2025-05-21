// src/components/Navbar/NotificationBell.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { FaBell } from "react-icons/fa";
import notificationApi from "@/apis/notificationApi";
import useMeStore from "@/zustand/useMeStore";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useMeStore();
    const [eventSource, setEventSource] = useState(null);

    // Load thông báo từ API
    const loadNotifications = useCallback(async (pageNum = 0) => {
        try {
            const response = await notificationApi.getNotifications(pageNum);
            if (response.status === "success") {
                const newNotifications = response.data.content;
                setNotifications(prev =>
                    pageNum === 0 ? newNotifications : [...prev, ...newNotifications]
                );
                setUnreadCount(newNotifications.filter(n => !n.isRead).length);
                setHasMore(!response.data.last);
            }
        } catch (error) {
            console.error("Error loading notifications:", error);
        }
    }, []);

    // Xử lý thông báo mới
    const handleNewNotification = useCallback((event) => {
        const newNotification = JSON.parse(event.data);
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
    }, []);

    // Thiết lập SSE connection
    useEffect(() => {
        if (user?.userId) {
            const eventSource = new EventSource(
                `${import.meta.env.VITE_API_URL}/notifications/subscribe/${user.userId}`
            );

            eventSource.onmessage = handleNewNotification;
            eventSource.onerror = (error) => {
                console.error("SSE Error:", error);
                eventSource.close();
            };

            setEventSource(eventSource);

            return () => {
                eventSource.close();
            };
        }
    }, [user?.userId, handleNewNotification]);

    // Load thông báo khi mở popover
    useEffect(() => {
        if (isPopoverOpen) {
            loadNotifications(0);
            setPage(0);
        }
    }, [isPopoverOpen, loadNotifications]);

    // Load more khi scroll
    const handleScroll = useCallback((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadNotifications(nextPage);
        }
    }, [page, hasMore, loadNotifications]);

    // Đánh dấu thông báo đã đọc
    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationApi.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, read: true }
                        : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Đánh dấu tất cả đã đọc
    const handleMarkAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, read: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                <button className="relative p-2">
                    <FaBell className="text-xl" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Thông báo</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-blue-500 hover:text-blue-700"
                        >
                            Đánh dấu tất cả đã đọc
                        </button>
                    )}
                </div>
                <div
                    className="mt-2 max-h-64 overflow-y-auto"
                    onScroll={handleScroll}
                >
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-2 border-b hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''
                                    }`}
                                onClick={() => handleMarkAsRead(notif.id)}
                            >
                                <p className="text-sm font-medium">{notif.title}</p>
                                <p className="text-sm text-gray-600">{notif.content}</p>
                                <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(notif.createdAt), {
                                        addSuffix: true,
                                        locale: vi
                                    })}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">Không có thông báo nào.</p>
                    )}
                    {hasMore && (
                        <div className="text-center py-2">
                            <span className="text-sm text-gray-500">Đang tải thêm...</span>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;

// import React, { useEffect, useState } from "react";
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
// import { FaBell } from "react-icons/fa";
//
// // Dữ liệu mock thông báo
// const mockNotifications = [
//     { id: 1, message: "Bạn có một tin nhắn mới từ chủ trọ.", createdAt: "5 phút trước" },
//     { id: 2, message: "Bài đăng của bạn đã được duyệt!", createdAt: "1 giờ trước" },
//     { id: 3, message: "Có phòng mới phù hợp với bạn.", createdAt: "Hôm qua" },
// ];
//
// const NotificationBell = () => {
//     const [notifications, setNotifications] = useState([]);
//     const [isPopoverOpen, setIsPopoverOpen] = useState(false);
//
//     // Giả lập gọi API bằng useEffect
//     useEffect(() => {
//         if (isPopoverOpen) {
//             setTimeout(() => {
//                 setNotifications(mockNotifications); // Giả lập lấy dữ liệu từ API
//             }, 500);
//         }
//     }, [isPopoverOpen]);
//
//     return (
//         <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
//             <PopoverTrigger asChild>
//                 <button className="relative p-2">
//                     <FaBell className="text-xl" />
//                     {notifications.length > 0 && (
//                         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
//                             {notifications.length}
//                         </span>
//                     )}
//                 </button>
//             </PopoverTrigger>
//             <PopoverContent className="w-80 p-3">
//                 <h3 className="text-lg font-semibold">Thông báo</h3>
//                 <div className="mt-2 max-h-64 overflow-y-auto">
//                     {notifications.length > 0 ? (
//                         notifications.map((notif) => (
//                             <div key={notif.id} className="p-2 border-b">
//                                 <p className="text-sm">{notif.message}</p>
//                                 <span className="text-xs text-gray-500">{notif.createdAt}</span>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="text-sm text-gray-500">Không có thông báo nào.</p>
//                     )}
//                 </div>
//             </PopoverContent>
//         </Popover>
//     );
// };
//
// export default NotificationBell;