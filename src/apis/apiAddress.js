import axiosClient from "@/apis/axiosClient";

// API methods to fetch address-related data
const apiAddress = {
    getProvinces: async (keyword = "") => {
        try {
            const data = await axiosClient.getOne(`/administrative/provinces?keyword=${keyword}`);
            return data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error);
            throw error;
        }
    },
    getDistricts: async (province, keyword = "") => {
        try {
            const data = await axiosClient.getOne(`/administrative/districts/${province}?keyword=${keyword}`);
            return data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách quận/huyện:", error);
            throw error;
        }
    },
    getWards: async (district, keyword = "") => {
        try {
            const data = await axiosClient.getOne(`/administrative/wards/${district}?keyword=${keyword}`);
            return data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phường/xã:", error);
            throw error;
        }
    },
};

export default apiAddress;
