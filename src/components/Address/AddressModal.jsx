import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiAddress from "@/apis/apiAddress";

const AddressModal = ({ isOpen, onClose, address, onAddressChange, onSave }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(address.province || "");
    const [selectedDistrict, setSelectedDistrict] = useState(address.district || "");

    // Fetch danh sách tỉnh
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

    // Fetch danh sách quận/huyện khi chọn tỉnh
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const data = await apiAddress.getDistricts(selectedProvince);
                    setDistricts(data);
                } catch (error) {
                    console.error("Không thể lấy danh sách quận/huyện:", error);
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]);
        }
    }, [selectedProvince]);

    // Fetch danh sách phường/xã khi chọn quận/huyện
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const data = await apiAddress.getWards(selectedDistrict);
                    setWards(data);
                } catch (error) {
                    console.error("Không thể lấy danh sách phường/xã:", error);
                }
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    const handleProvinceChange = (province) => {
        setSelectedProvince(province);
        onAddressChange({ ...address, province, district: "", commune: "" });
    };

    const handleDistrictChange = (district) => {
        setSelectedDistrict(district);
        onAddressChange({ ...address, district, commune: "" });
    };

    const handleWardChange = (ward) => {
        onAddressChange({ ...address, commune: ward });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[700px] p-0 max-w-lg">
                <DialogHeader>
                    <DialogTitle className="mt-4 ml-4">Địa chỉ</DialogTitle>
                    <div className="grid grid-cols-1 gap-4 p-4">
                        {/* Tỉnh/Thành phố */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn tỉnh, thành phố *
                            </label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={selectedProvince}
                                onChange={(e) => handleProvinceChange(e.target.value)}
                            >
                                <option value="">-- Chọn tỉnh/thành phố --</option>
                                {provinces.map((province) => (
                                    <option key={province} value={province}>
                                        {province}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Quận/Huyện */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn quận, huyện, thị xã *
                            </label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={selectedDistrict}
                                onChange={(e) => handleDistrictChange(e.target.value)}
                                disabled={!selectedProvince}
                            >
                                <option value="">-- Chọn quận/huyện --</option>
                                {districts.map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Phường/Xã */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn phường, xã, thị trấn *
                            </label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={address.commune || ""}
                                onChange={(e) => handleWardChange(e.target.value)}
                                disabled={!selectedDistrict}
                            >
                                <option value="">-- Chọn phường/xã --</option>
                                {wards.map((ward) => (
                                    <option key={ward} value={ward}>
                                        {ward}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Tên đường */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đường *
                            </label>
                            <Input
                                value={address.street || ""}
                                onChange={(e) => onAddressChange({ ...address, street: e.target.value })}
                                placeholder="Tên đường"
                            />
                        </div>
                        {/* Số nhà */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số nhà *
                            </label>
                            <Input
                                value={address.houseNumber || ""}
                                onChange={(e) => onAddressChange({ ...address, houseNumber: e.target.value })}
                                placeholder="Số nhà"
                            />
                        </div>
                    </div>
                </DialogHeader>
                <div className="flex justify-between p-4">
                    <Button variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                    <Button
                        onClick={() => {
                            onSave(address);
                            onClose();
                        }}
                        disabled={
                            !address.province ||
                            !address.district ||
                            !address.commune ||
                            !address.street ||
                            !address.houseNumber
                        }
                    >
                        Lưu địa chỉ
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddressModal;
