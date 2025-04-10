import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddressModal from "../Address/AddressModal";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import axiosClient from "@/apis/axiosClient";
import { useToast } from "@/hooks/use-toast";

const NotificationDialog = ({ open, onOpenChange }) => {
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const { toast } = useToast();
    const [userInfo, setUserInfo] = useState({
        name: "",
        phone: "",
        email: "",
        address: {
            province: "",
            district: "",
            commune: "",
            street: "",
            houseNumber: "",
        },
        minPrice: "",
        maxPrice: "",
        minArea: "",
        maxArea: "",
        furnitureStatus: "",
    });

    const handleAddressChange = (newAddress) => {
        setUserInfo({ ...userInfo, address: newAddress });
    };

    const handleRegister = async () => {
        const payload = {
            minPrice: Number(userInfo.minPrice),
            maxPrice: Number(userInfo.maxPrice),
            minArea: Number(userInfo.minArea),
            maxArea: Number(userInfo.maxArea),
            furnitureStatus: userInfo.furnitureStatus,
            city: userInfo.address.province,
            district: userInfo.address.district,
            ward: userInfo.address.commune,
        };

        console.log("Dữ liệu gửi đi:", payload);

        try {
            await axiosClient.post("/search-information/create", payload);
            toast({
                description: "Đăng ký nhận thông báo thành công!",
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error.message);
            toast({
                description: "Có lỗi xảy ra, vui lòng thử lại!",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Đăng ký nhận thông báo</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin của bạn để nhận thông báo khi có phòng phù hợp.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="address">Khu vực mong muốn</Label>
                        <Input
                            id="address"
                            value={
                                userInfo.address.province ||
                                    userInfo.address.district ||
                                    userInfo.address.commune ||
                                    userInfo.address.street ||
                                    userInfo.address.houseNumber
                                    ? `${userInfo.address.houseNumber ? userInfo.address.houseNumber + ", " : ""}${userInfo.address.street ? userInfo.address.street + ", " : ""}${userInfo.address.commune ? userInfo.address.commune + ", " : ""}${userInfo.address.district ? userInfo.address.district + ", " : ""}${userInfo.address.province ? userInfo.address.province : ""}`
                                    : "Chọn địa chỉ"
                            }
                            onClick={() => setIsAddressModalOpen(true)}
                            placeholder="Nhập quận, phường hoặc địa điểm cụ thể"
                            readOnly
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="minPrice">Giá tối thiểu</Label>
                            <Input
                                id="minPrice"
                                type="number"
                                value={userInfo.minPrice}
                                onChange={(e) => setUserInfo({ ...userInfo, minPrice: e.target.value })}
                                placeholder="VNĐ"
                            />
                        </div>
                        <div>
                            <Label htmlFor="maxPrice">Giá tối đa</Label>
                            <Input
                                id="maxPrice"
                                type="number"
                                value={userInfo.maxPrice}
                                onChange={(e) => setUserInfo({ ...userInfo, maxPrice: e.target.value })}
                                placeholder="VNĐ"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="minArea">Diện tích tối thiểu</Label>
                            <Input
                                id="minArea"
                                type="number"
                                value={userInfo.minArea}
                                onChange={(e) => setUserInfo({ ...userInfo, minArea: e.target.value })}
                                placeholder="m²"
                            />
                        </div>
                        <div>
                            <Label htmlFor="maxArea">Diện tích tối đa</Label>
                            <Input
                                id="maxArea"
                                type="number"
                                value={userInfo.maxArea}
                                onChange={(e) => setUserInfo({ ...userInfo, maxArea: e.target.value })}
                                placeholder="m²"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                            Tình trạng nội thất
                        </Label>
                        <Select
                            value={userInfo.furnitureStatus}
                            onValueChange={(value) => setUserInfo({ ...userInfo, furnitureStatus: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn tình trạng nội thất" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FULL">Đầy đủ nội thất</SelectItem>
                                <SelectItem value="EMPTY">Không có nội thất</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button className="bg-primary text-white" onClick={handleRegister}>
                        Xác nhận đăng ký
                    </Button>
                </div>
            </DialogContent>

            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                address={userInfo.address}
                onAddressChange={handleAddressChange}
                onSave={handleAddressChange}
            />
        </Dialog>
    );
};

export default NotificationDialog;
