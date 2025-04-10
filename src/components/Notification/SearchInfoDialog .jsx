import { useEffect, useState } from "react";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import axiosClient from "@/apis/axiosClient";
import { useToast } from "@/hooks/use-toast";

const SearchInfoDialog = ({ open, onOpenChange }) => {
    const { toast } = useToast();
    const [searchInfo, setSearchInfo] = useState({
        minPrice: "",
        maxPrice: "",
        minArea: "",
        maxArea: "",
        furnitureStatus: "",
        city: "",
        district: "",
        ward: "",
    });

    useEffect(() => {
        if (open) {
            fetchSearchInfo();
        }
    }, [open]);

    const fetchSearchInfo = async () => {
        try {
            const response = await axiosClient.getMany("/search-information/detail");
            setSearchInfo(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin tìm phòng:", error);
            toast({
                description: "Không thể lấy thông tin tìm phòng!",
                variant: "destructive",
            });
        }
    };

    const handleUpdate = async () => {
        try {
            await axiosClient.put("/search-information/update", searchInfo);
            toast({
                description: "Cập nhật thông tin thành công!",
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
            toast({
                description: "Có lỗi xảy ra khi cập nhật!",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thông tin tìm phòng</DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa thông tin tìm phòng của bạn và lưu lại.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Giá tối thiểu</Label>
                            <Input
                                type="number"
                                value={searchInfo.minPrice}
                                onChange={(e) => setSearchInfo({ ...searchInfo, minPrice: e.target.value })}
                                placeholder="VNĐ"
                            />
                        </div>
                        <div>
                            <Label>Giá tối đa</Label>
                            <Input
                                type="number"
                                value={searchInfo.maxPrice}
                                onChange={(e) => setSearchInfo({ ...searchInfo, maxPrice: e.target.value })}
                                placeholder="VNĐ"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Diện tích tối thiểu</Label>
                            <Input
                                type="number"
                                value={searchInfo.minArea}
                                onChange={(e) => setSearchInfo({ ...searchInfo, minArea: e.target.value })}
                                placeholder="m²"
                            />
                        </div>
                        <div>
                            <Label>Diện tích tối đa</Label>
                            <Input
                                type="number"
                                value={searchInfo.maxArea}
                                onChange={(e) => setSearchInfo({ ...searchInfo, maxArea: e.target.value })}
                                placeholder="m²"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Tình trạng nội thất</Label>
                        <Select
                            value={searchInfo.furnitureStatus}
                            onValueChange={(value) => setSearchInfo({ ...searchInfo, furnitureStatus: value })}
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
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Thành phố</Label>
                            <Input
                                value={searchInfo.city}
                                onChange={(e) => setSearchInfo({ ...searchInfo, city: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Quận</Label>
                            <Input
                                value={searchInfo.district}
                                onChange={(e) => setSearchInfo({ ...searchInfo, district: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Phường</Label>
                            <Input
                                value={searchInfo.ward}
                                onChange={(e) => setSearchInfo({ ...searchInfo, ward: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button className="bg-primary text-white" onClick={handleUpdate}>
                            Cập nhật thông tin
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SearchInfoDialog;
