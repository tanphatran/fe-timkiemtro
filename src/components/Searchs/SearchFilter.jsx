import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FiSearch, FiFilter } from "react-icons/fi"; // Icon
import { MdLocationOn, MdOutlineHome, MdAttachMoney } from "react-icons/md"; // Icon

const SearchFilter = () => {
    const [region, setRegion] = useState("Toàn quốc");
    const [propertyType, setPropertyType] = useState("Loại bất động sản");
    const [rentalPrice, setRentalPrice] = useState("Giá thuê");

    return (
        <div className="p-3 bg-white rounded-md shadow-sm flex flex-wrap gap-4 md:items-center md:justify-center">
            {/* Input tìm kiếm */}
            <div className="flex items-center w-full md:max-w-sm flex-grow">
                <FiSearch className="mr-2 text-gray-400" size={20} />
                <Input
                    placeholder="Từ khóa, Đường, Quận, Dự án hoặc địa điểm..."
                    className="w-full"
                />
            </div>

            {/* Khu vực */}
            <div className="hidden md:flex items-center">
                <Select onValueChange={setRegion}>
                    <SelectTrigger className="flex items-center w-36 border border-gray-300 rounded-lg p-2">
                        <MdLocationOn className="mr-2 text-gray-500" size={20} />
                        <span>{region}</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Toàn quốc">Toàn quốc</SelectItem>
                        <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                        <SelectItem value="TP.HCM">TP.HCM</SelectItem>
                        <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Loại bất động sản */}
            <div className="hidden md:flex items-center">
                <Select onValueChange={setPropertyType}>
                    <SelectTrigger className="flex items-center w-48 border border-gray-300 rounded-lg p-2">
                        <MdOutlineHome className="mr-2 text-gray-500" size={20} />
                        <span>{propertyType}</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Chung cư">Chung cư</SelectItem>
                        <SelectItem value="Nhà phố">Nhà phố</SelectItem>
                        <SelectItem value="Biệt thự">Biệt thự</SelectItem>
                        <SelectItem value="Đất nền">Đất nền</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Giá thuê */}
            <div className="hidden md:flex items-center">
                <Select onValueChange={setRentalPrice}>
                    <SelectTrigger className="flex items-center w-40 border border-gray-300 rounded-lg p-2">
                        <MdAttachMoney className="mr-2 text-gray-500" size={20} />
                        <span>{rentalPrice}</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Dưới 5 triệu">Dưới 5 triệu</SelectItem>
                        <SelectItem value="5 - 10 triệu">5 - 10 triệu</SelectItem>
                        <SelectItem value="10 - 20 triệu">10 - 20 triệu</SelectItem>
                        <SelectItem value="Trên 20 triệu">Trên 20 triệu</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Lọc thêm */}
            <Button
                variant="outline"
                className="flex items-center gap-2 w-full md:w-auto border border-gray-300 rounded-lg p-2"
            >
                <FiFilter size={20} className="text-gray-600" />
                <span className="hidden md:inline">Lọc thêm</span>
            </Button>
        </div>
    );
};

export default SearchFilter;
