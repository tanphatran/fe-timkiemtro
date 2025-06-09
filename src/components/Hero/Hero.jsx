import React, { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import apiAddress from "@/apis/apiAddress";

const Hero = () => {
    const [priceDisplay, setPriceDisplay] = useState("Tất cả mức giá");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [appliedPrice, setAppliedPrice] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Address states
    const [city, setCity] = useState(null);
    const [district, setDistrict] = useState(null);
    const [ward, setWard] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const navigate = useNavigate();

    // Fetch provinces on component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await apiAddress.getProvinces();
                setProvinces(data);
            } catch (error) {
                console.error("Không thể lấy danh sách tỉnh:", error);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch districts when city changes
    useEffect(() => {
        if (city) {
            const fetchDistricts = async () => {
                try {
                    const data = await apiAddress.getDistricts(city);
                    setDistricts(data);
                    setDistrict(null);
                    setWard(null);
                } catch (error) {
                    console.error("Không thể lấy danh sách quận/huyện:", error);
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]);
        }
    }, [city]);

    // Fetch wards when district changes
    useEffect(() => {
        if (district) {
            const fetchWards = async () => {
                try {
                    const data = await apiAddress.getWards(district);
                    setWards(data);
                    setWard(null);
                } catch (error) {
                    console.error("Không thể lấy danh sách phường/xã:", error);
                }
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [district]);

    const handleApplyPrice = () => {
        if (minPrice && maxPrice) {
            setPriceDisplay(`Từ ${minPrice} → ${maxPrice}`);
            setAppliedPrice(`Từ ${minPrice} → ${maxPrice}`);
        } else {
            setPriceDisplay("Tất cả mức giá");
            setAppliedPrice("Tất cả mức giá");
        }
    };

    const handleSearch = () => {
        const queryParams = new URLSearchParams();

        if (minPrice) {
            queryParams.append('minPrice', minPrice);
        }
        if (maxPrice) {
            queryParams.append('maxPrice', maxPrice);
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
            queryParams.append('keyword', searchQuery);
        }
        if (selectedArea) {
            queryParams.append('area', selectedArea);
        }

        navigate(`/results?${queryParams.toString()}`, { replace: true });
    };

    return (
        <div className="bg-black/20 h-full">
            <div className="h-full flex justify-center items-center p-4  bg-primary/10">
                <div className="container grid grid-cols-1 gap-4 ">
                    <div data-aos="fade-up" data-aos-delay="600" className="bg-white rounded-md p-4 pb-6 relative">
                        {/* Input "Tìm kiếm phòng trọ" */}
                        <div className="grid grid-cols-1">
                            <label htmlFor="destination" className="opacity-70">
                                Tìm kiếm phòng trọ
                            </label>
                            <input
                                type="text"
                                name="destination"
                                id="destination"
                                placeholder="Phòng trọ tốt"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-100 mt-2 focus:outline-primary focus:outline outline-1 rounded-sm p-2"
                            />
                        </div>

                        {/* Các trường chọn */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {/* Loại nhà đất */}
                            <div>
                                <label htmlFor="type" className="block text-gray-600 mb-1">
                                    Địa chỉ
                                </label>
                                <Select onValueChange={(value) => setCity(value)}>
                                    <SelectTrigger className="w-full">
                                        <span className="text-base">{city || "Chọn thành phố"}</span>
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

                            {/* Mức giá */}
                            <div>
                                <label htmlFor="price" className="block text-gray-600 mb-1">
                                    Mức giá
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="w-full bg-gray-100 rounded-sm p-2 text-left">
                                            {priceDisplay}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-96 p-4">
                                        <h3 className="text-lg font-semibold mb-4">Mức giá</h3>

                                        {/* Input giá */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="Từ"
                                                value={minPrice}
                                                onChange={(e) => {
                                                    setMinPrice(e.target.value);
                                                    setPriceDisplay(
                                                        e.target.value && maxPrice
                                                            ? `Từ ${e.target.value} → ${maxPrice}`
                                                            : `Tất cả mức giá`
                                                    );
                                                }}
                                                className="w-full bg-gray-100 border rounded-md p-2"
                                            />
                                            <span className="text-gray-500">→</span>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="Đến"
                                                value={maxPrice}
                                                onChange={(e) => {
                                                    setMaxPrice(e.target.value);
                                                    setPriceDisplay(
                                                        minPrice && e.target.value
                                                            ? `Từ ${minPrice} → ${e.target.value}`
                                                            : `Tất cả mức giá`
                                                    );
                                                }}
                                                className="w-full bg-gray-100 border rounded-md p-2"
                                            />
                                        </div>

                                        {/* Danh sách mức giá */}
                                        <ul className="space-y-2 mb-4">
                                            {[
                                                "Tất cả mức giá",
                                                "Dưới 1 triệu",
                                                "1 - 3 triệu",
                                                "3 - 5 triệu",
                                                "5 - 10 triệu",
                                            ].map((range) => (
                                                <li key={range}>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="price-range"
                                                            onChange={() => {
                                                                if (range === "Dưới 1 triệu") {
                                                                    setMinPrice("0");
                                                                    setMaxPrice("1000000");
                                                                } else if (range === "1 - 3 triệu") {
                                                                    setMinPrice("1000000");
                                                                    setMaxPrice("3000000");
                                                                } else if (range === "3 - 5 triệu") {
                                                                    setMinPrice("3000000");
                                                                    setMaxPrice("5000000");
                                                                } else if (range === "5 - 10 triệu") {
                                                                    setMinPrice("5000000");
                                                                    setMaxPrice("10000000");
                                                                } else {
                                                                    setMinPrice("");
                                                                    setMaxPrice("");
                                                                }

                                                                setPriceDisplay(range);
                                                                setAppliedPrice(range);
                                                            }}
                                                            className="text-primary focus:ring-primary"
                                                        />
                                                        <span>{range}</span>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Nút "Áp dụng" */}
                                        <button
                                            onClick={handleApplyPrice}
                                            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark"
                                        >
                                            Áp dụng
                                        </button>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Diện tích */}
                            <div>
                                <label htmlFor="area" className="block text-gray-600 mb-1">
                                    Diện tích
                                </label>
                                <Select onValueChange={(value) => setSelectedArea(value)}>
                                    <SelectTrigger className="w-full">
                                        <span className="text-base">{selectedArea || "Chọn diện tích"}</span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Dưới 10m²">Dưới 10m²</SelectItem>
                                        <SelectItem value="10 - 15m²">10 - 15m²</SelectItem>
                                        <SelectItem value="15 - 20m²">15 - 20m²</SelectItem>
                                        <SelectItem value="Trên 20m²">Trên 20m²</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Nút "Tìm kiếm" */}
                        <button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 px-4 py-2 rounded-full duration-200 absolute -bottom-5 left-1/2 -translate-x-1/2 shadow-md"
                            style={{ marginTop: "10px" }}
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
