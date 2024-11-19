import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FiSearch, FiFilter } from "react-icons/fi"; // Import icons từ react-icons
import { MdLocationOn, MdOutlineHome, MdAttachMoney } from "react-icons/md"; // Thêm các icon cho SelectTrigger

const SearchFilter = () => {
    // State cho từng trường chọn
    const [region, setRegion] = useState("Toàn quốc");
    const [propertyType, setPropertyType] = useState("Loại bất động sản");
    const [rentalPrice, setRentalPrice] = useState("Giá thuê");

    return (
        <div className="flex gap-4 justify-center items-center p-3 bg-white  rounded-md shadow-sm">
            {/* Từ khóa */}
            <div className="flex items-center w-full max-w-sm">
                <FiSearch className="mr-2 text-gray-400" size={20} />
                <Input
                    placeholder="Từ khóa, Đường, Quận, Dự án hoặc địa điểm..."
                    className="w-full"
                />
            </div>

            {/* Khu vực */}
            <Select onValueChange={setRegion}>
                <SelectTrigger className="w-36" icon={MdLocationOn}>
                    <span>{region}</span>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Toàn quốc">Toàn quốc</SelectItem>
                    <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                    <SelectItem value="TP.HCM">TP.HCM</SelectItem>
                    <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                </SelectContent>
            </Select>

            {/* Loại bất động sản */}
            <Select onValueChange={setPropertyType}>
                <SelectTrigger className="w-48" icon={MdOutlineHome}>
                    <span>{propertyType}</span>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Chung cư">Chung cư</SelectItem>
                    <SelectItem value="Nhà phố">Nhà phố</SelectItem>
                    <SelectItem value="Biệt thự">Biệt thự</SelectItem>
                    <SelectItem value="Đất nền">Đất nền</SelectItem>
                </SelectContent>
            </Select>

            {/* Giá thuê */}
            <Select onValueChange={setRentalPrice}>
                <SelectTrigger className="w-40" icon={MdAttachMoney}>
                    <span>{rentalPrice}</span>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Dưới 5 triệu">Dưới 5 triệu</SelectItem>
                    <SelectItem value="5 - 10 triệu">5 - 10 triệu</SelectItem>
                    <SelectItem value="10 - 20 triệu">10 - 20 triệu</SelectItem>
                    <SelectItem value="Trên 20 triệu">Trên 20 triệu</SelectItem>
                </SelectContent>
            </Select>

            {/* Bộ lọc thêm */}
            <Button variant="outline" className="flex items-center gap-2">
                <FiFilter size={20} className="text-gray-600" />
                Lọc thêm
            </Button>
        </div>
    );
};

export default SearchFilter;
