import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { FiSearch, FiFilter } from "react-icons/fi";
import { MdLocationOn, MdOutlineHome } from "react-icons/md";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import apiAddress from "@/apis/apiAddress"; // Import API address functions
import { useNavigate } from "react-router-dom";

const SearchFilter = () => {
    const [priceRange, setPriceRange] = useState([0, 50000000]);
    const [appliedPriceRange, setAppliedPriceRange] = useState([0, 50000000]);

    const [areaRange, setAreaRange] = useState([0, 100]);
    const [appliedAreaRange, setAppliedAreaRange] = useState([0, 100]);

    const [city, setCity] = useState(null);
    const [district, setDistrict] = useState(null);
    const [ward, setWard] = useState(null);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    // Fetch provinces (cities) on component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await apiAddress.getProvinces(); // Assuming this function fetches provinces
                setProvinces(data);
            } catch (error) {
                console.error("Không thể lấy danh sách tỉnh:", error);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch districts when a province is selected
    useEffect(() => {
        if (city) {
            const fetchDistricts = async () => {
                try {
                    const data = await apiAddress.getDistricts(city); // Fetch districts based on selected province
                    setDistricts(data);
                    setDistrict(null);  // Reset district when city changes
                    setWard(null);      // Reset ward when city changes
                } catch (error) {
                    console.error("Không thể lấy danh sách quận/huyện:", error);
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]);
        }
    }, [city]);

    // Fetch wards when a district is selected
    useEffect(() => {
        if (district) {
            const fetchWards = async () => {
                try {
                    const data = await apiAddress.getWards(district); // Fetch wards based on selected district
                    setWards(data);
                    setWard(null); // Reset ward when district changes
                } catch (error) {
                    console.error("Không thể lấy danh sách phường/xã:", error);
                }
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [district]);

    const handleSliderChange = (value) => {
        setPriceRange(value);
    };
    const handleSliderChangeArea = (value) => {
        setAreaRange(value);
    };
    const applyPriceFilter = () => {
        setAppliedPriceRange(priceRange); // Lưu giá trị đã áp dụng
    };
    const applyAreaFilter = () => {
        setAppliedAreaRange(areaRange); // Lưu giá trị đã áp dụng
    };
    const formatPrice = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)} triệu`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)} nghìn`;
        }
        return `${value} đ`;
    };

    const formatArea = (value) => {

        return `${value} m²`;
    };

    const getPriceDisplay = () => {
        const [min, max] = appliedPriceRange;
        if (min === 0 && max === 50000000) return "Giá thuê";
        return `${formatPrice(min)} - ${formatPrice(max)}`;
    };

    const getAreaDisplay = () => {
        const [min, max] = appliedAreaRange;
        if (min === 0 && max === 100) return "Diện tích";
        return `${formatArea(min)} - ${formatArea(max)}`;
    };

    const applyFilters = () => {
        // Tạo chuỗi query cho URL
        const queryParams = new URLSearchParams();

        if (appliedPriceRange[0] !== 0) {
            queryParams.append('minPrice', appliedPriceRange[0]);
        }
        if (appliedPriceRange[1] !== 50000000) {
            queryParams.append('maxPrice', appliedPriceRange[1]);
        }
        if (city) {
            queryParams.append('city', city);
        }
        if (district) {
            queryParams.append('district', district);
        }
        if (ward) {
            queryParams.append('ward', ward);
        }
        if (searchQuery) {
            queryParams.append('keyword', searchQuery); // Thêm giá trị tìm kiếm vào URL
        }
        if (appliedAreaRange[0] !== 0) {
            queryParams.append('minArea', appliedAreaRange[0]);
        }
        if (appliedAreaRange[1] !== 100) {
            queryParams.append('maxArea', appliedAreaRange[1]);
        }
        console.log("URL cập nhật:", `/results?${queryParams.toString()}`);
        // Cập nhật URL với các tham số mới và làm mới trang
        navigate(`/results?${queryParams.toString()}`, { replace: true });  // Sử dụng 'replace' để tránh thêm nhiều trang vào lịch sử
    };


    return (
        <div className="p-3 bg-white rounded-md shadow-sm flex flex-col gap-6 md:flex-row md:items-center md:justify-center">
            {/* Input tìm kiếm */}
            <div className="flex items-center w-full md:max-w-sm">
                <FiSearch className="mr-2 text-gray-400" size={20} />
                <Input
                    placeholder="Tìm kiếm theo từ khóa..."
                    className="w-full"
                    value={searchQuery} // Liên kết giá trị input với state searchQuery
                    onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật giá trị khi người dùng nhập
                />
            </div>

            {/* Thành phố */}
            <div className="flex items-center">
                <Select onValueChange={(value) => setCity(value)}>
                    <SelectTrigger className="flex items-center w-44 border border-gray-300 rounded-lg p-2">
                        <MdLocationOn className="mr-2 text-gray-500" size={20} />
                        <span>{city || "Chọn thành phố"}</span>
                    </SelectTrigger>
                    <SelectContent>
                        {provinces.map((province) => (
                            <SelectItem key={province} value={province}>
                                {province}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Quận */}
            <div className="flex items-center">
                <Select onValueChange={(value) => setDistrict(value)}>
                    <SelectTrigger className="flex items-center w-40 border border-gray-300 rounded-lg p-2">
                        <MdOutlineHome className="mr-2 text-gray-500" size={20} />
                        <span>{district || "Chọn quận"}</span>
                    </SelectTrigger>
                    <SelectContent>
                        {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                                {district}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Phường */}
            <div className="flex items-center">
                <Select onValueChange={(value) => setWard(value)}>
                    <SelectTrigger className="flex items-center w-40 border border-gray-300 rounded-lg p-2">
                        <MdOutlineHome className="mr-2 text-gray-500" size={20} />
                        <span>{ward || "Chọn phường"}</span>
                    </SelectTrigger>
                    <SelectContent>
                        {wards.map((ward) => (
                            <SelectItem key={ward} value={ward}>
                                {ward}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Khoảng giá */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button className=" bg-white text-gray flex items-center gap-2 border border-gray-300 rounded-lg p-2 ">
                        <FiFilter size={20} />
                        {getPriceDisplay()}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-white shadow-md rounded-lg border">
                    <div className="text-sm font-medium mb-4">Chọn khoảng giá</div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>0</span>
                        <span>50 triệu</span>
                    </div>
                    <Slider
                        className="mt-2"
                        value={priceRange}
                        min={0}
                        max={50000000}
                        step={500000} // Tăng/giảm 500 nghìn
                        onValueChange={handleSliderChange}
                    />
                    <div className="flex gap-2 mt-4">
                        <Input
                            type="number"
                            placeholder="Giá tối thiểu"
                            value={priceRange[0]}
                            onChange={(e) => {
                                const newValue = [
                                    Math.min(Number(e.target.value), priceRange[1]),
                                    priceRange[1],
                                ];
                                setPriceRange(newValue);
                            }}
                            className="w-full"
                        />
                        <span>-</span>
                        <Input
                            type="number"
                            placeholder="Giá tối đa"
                            value={priceRange[1]}
                            onChange={(e) => {
                                const newValue = [
                                    priceRange[0],
                                    Math.max(priceRange[0], Number(e.target.value)),
                                ];
                                setPriceRange(newValue);
                            }}
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="outline"
                            className="text-gray-600"
                            onClick={() => setPriceRange([0, 50000000])}
                        >
                            Xóa
                        </Button>
                        <Button
                            variant="default"
                            className="bg-primary text-white"
                            onClick={applyPriceFilter}
                        >
                            Áp dụng
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Diện tích */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button className=" bg-white text-gray flex items-center gap-2 border border-gray-300 rounded-lg p-2 ">
                        <FiFilter size={20} />
                        {getAreaDisplay()}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-white shadow-md rounded-lg border">
                    <div className="text-sm font-medium mb-4">Chọn diện tích</div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>0 m²</span>
                        <span>100 m²</span>
                    </div>
                    <Slider
                        className="mt-2"
                        value={areaRange}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleSliderChangeArea}
                    />
                    <div className="flex gap-2 mt-4">
                        <Input
                            type="number"
                            min={0}
                            placeholder="Diện tích tối thiểu"
                            value={areaRange[0]}
                            onChange={(e) => {
                                const newValue = [
                                    Math.min(Number(e.target.value), areaRange[1]),
                                    areaRange[1],
                                ];
                                setAreaRange(newValue);
                            }}
                            className="w-full"
                        />
                        <span>-</span>
                        <Input
                            type="number"
                            min={0}
                            placeholder="Diện tích tối đa"
                            value={areaRange[1]}
                            onChange={(e) => {
                                const newValue = [
                                    areaRange[0],
                                    Math.max(areaRange[0], Number(e.target.value)),
                                ];
                                setAreaRange(newValue);
                            }}
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="outline"
                            className="text-gray-600"
                            onClick={() => setAreaRange([0, 100])}
                        >
                            Xóa
                        </Button>
                        <Button
                            variant="default"
                            className="bg-primary text-white"
                            onClick={applyAreaFilter}
                        >
                            Áp dụng
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Apply Filter Button */}
            <div className="flex items-center">
                {/* Other filter elements here */}
                <Button
                    variant="default"
                    className="bg-gradient-to-r from-primary to-secondary  text-white "
                    onClick={applyFilters}
                >
                    Áp dụng
                </Button>
            </div>

        </div>
    );
};

export default SearchFilter;
