import axiosClient from "@/apis/axiosClient";

// API methods to fetch address-related data
const apiAddress = {
    // Lấy danh sách tỉnh/thành phố
    getProvinces: async () => {
        try {
            const data = await axiosClient.getOne("/administrative/provinces");
            return data; // Expected to return a list of provinces
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error);
            throw error;
        }
    },

    // Lấy danh sách quận/huyện theo tỉnh/thành phố
    getDistricts: async (province) => {
        try {
            const data = await axiosClient.getOne(`/administrative/districts/${province}`);
            return data; // Expected to return a list of districts for the province
        } catch (error) {
            console.error("Lỗi khi lấy danh sách quận/huyện:", error);
            throw error;
        }
    },

    // Lấy danh sách phường/xã theo quận/huyện
    getWards: async (district) => {
        try {
            const data = await axiosClient.getOne(`/administrative/wards/${district}`);
            return data; // Expected to return a list of wards for the district
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phường/xã:", error);
            throw error;
        }
    },
};

export default apiAddress;
