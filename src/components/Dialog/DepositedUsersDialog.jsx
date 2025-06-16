import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axiosClient from "@/apis/axiosClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { IoArrowBack } from "react-icons/io5";
import { MdHome, MdPerson, MdBusiness, MdInfo } from "react-icons/md";
import ComplaintDialog from "./ComplaintDialog";
import StatusDetailsDialog from "./StatusDetailsDialog";

const DepositedUsersDialog = ({ open, onOpenChange, depositedUsers }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [postDetails, setPostDetails] = useState(null);
    const [depositDetails, setDepositDetails] = useState(null);
    const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleUserClick = async (user) => {
        try {
            setSelectedUser(user);
            // Fetch post details
            const postResponse = await axiosClient.getOne(`post/detail/${user.postUuid}`);
            if (postResponse.data) {
                setPostDetails(postResponse.data);
            }

            // Fetch deposit details
            const depositResponse = await axiosClient.getOne(`v1/deposit/${user.depositId}/details`);
            if (depositResponse.data) {
                setDepositDetails(depositResponse.data);
            }
        } catch (error) {
            console.error("Error fetching details:", error);
            toast({
                title: "Lỗi",
                description: "Không thể lấy thông tin chi tiết",
                variant: "destructive",
            });
        }
    };

    const handleCloseDetails = () => {
        setSelectedUser(null);
        setPostDetails(null);
        setDepositDetails(null);
    };

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            const response = await axiosClient.post(`v1/deposit/${selectedUser.depositId}/confirm/landlord`);
            if (response.status === "success") {
                toast({ description: "Xác nhận thành công" });
                handleCloseDetails();
            }
        } catch (error) {
            console.error("Error confirming deposit:", error);
            toast({
                title: "Lỗi",
                description: "Không thể xác nhận đặt cọc",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-center">Danh sách người đặt cọc</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        {!selectedUser ? (
                            <div className="grid gap-3">
                                {depositedUsers.map((user) => (
                                    <div
                                        key={user.depositId}
                                        className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-gray-100 hover:border-primary/20 hover:shadow-md"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                            <AvatarImage src={user.profilePicture} alt={user.fullName} />
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {user.fullName
                                                    .split(" ")
                                                    .map((word) => word[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{user.fullName}</p>
                                            <p className="text-sm text-gray-500">ID: {user.userId}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <button
                                        onClick={handleCloseDetails}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                                    >
                                        <IoArrowBack size={18} />
                                        Quay lại danh sách
                                    </button>
                                    <h3 className="text-lg font-semibold text-gray-900">Chi tiết đặt cọc</h3>
                                </div>


                                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-primary">
                                        <MdInfo size={20} />
                                        <h4 className="font-semibold text-lg">Trạng thái đặt cọc</h4>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsStatusDialogOpen(true)}
                                            className="flex items-center gap-2"
                                        >
                                            <MdInfo size={18} />
                                            Xem trạng thái
                                        </Button>
                                    </div>
                                </div>


                                {postDetails && (
                                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 text-primary">
                                            <MdHome size={20} />
                                            <h4 className="font-semibold text-lg">Thông tin bài đăng</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500">Tiêu đề</p>
                                                <p className="font-medium text-gray-900">{postDetails.title}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500">Giá phòng</p>
                                                <p className="font-medium text-primary">{postDetails.price.toLocaleString()} đ</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500">Diện tích</p>
                                                <p className="font-medium text-gray-900">{postDetails.area} m²</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                                                <p className="font-medium text-gray-900">
                                                    {postDetails.houseNumber} {postDetails.street}, {postDetails.ward}, {postDetails.district}, {postDetails.city}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {depositDetails && (
                                    <div className="space-y-6">
                                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 text-primary">
                                                <MdPerson size={20} />
                                                <h4 className="font-semibold text-lg">Thông tin người đặt cọc</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">Họ tên</p>
                                                    <p className="font-medium text-gray-900">{depositDetails.depositorFullName}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                                    <p className="font-medium text-gray-900">{depositDetails.depositorEmail}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                                                    <p className="font-medium text-gray-900">{depositDetails.depositorPhoneNumber}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">Ngày đặt cọc</p>
                                                    <p className="font-medium text-gray-900">
                                                        {format(new Date(depositDetails.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 text-primary">
                                                <MdBusiness size={20} />
                                                <h4 className="font-semibold text-lg">Thông tin chủ trọ</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">Họ tên</p>
                                                    <p className="font-medium text-gray-900">{depositDetails.landlordFullName}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                                    <p className="font-medium text-gray-900">{depositDetails.landlordEmail}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                                                    <p className="font-medium text-gray-900">{depositDetails.landlordPhoneNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {depositDetails?.landlordConfirmed === null && (
                                    <DialogFooter className="mt-6">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsComplaintDialogOpen(true)}
                                            disabled={isLoading}
                                        >
                                            Khiếu nại
                                        </Button>
                                        <Button
                                            onClick={handleConfirm}
                                            disabled={isLoading}
                                        >
                                            Xác nhận
                                        </Button>
                                    </DialogFooter>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <ComplaintDialog
                open={isComplaintDialogOpen}
                onOpenChange={setIsComplaintDialogOpen}
                depositId={selectedUser?.depositId}
                onSuccess={handleCloseDetails}
                userType="landlord"
            />

            <StatusDetailsDialog
                open={isStatusDialogOpen}
                onOpenChange={setIsStatusDialogOpen}
                depositId={selectedUser?.depositId}
            />
        </>
    );
};

export default DepositedUsersDialog; 