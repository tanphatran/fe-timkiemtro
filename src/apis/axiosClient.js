import axios from "axios";
import useMeStore from "@/zustand/useMeStore"; // Lấy token từ zustand store

const baseURL = import.meta.env.VITE_API_URL;

function createApiClient() {
    const client = axios.create({
        baseURL,
        //   withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Interceptor để thêm token vào tất cả các request
    client.interceptors.request.use(
        (config) => {
            const token = useMeStore.getState().token;
            console.log("Token trong request:", token); // Log để kiểm tra token
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                console.warn("Không có token để gửi trong header Authorization");
            }
            return config;
        },
        (error) => Promise.reject(error)
    );


    return {
        get: async (endpoint, config = {}) => {
            try {
                const response = await client.get(endpoint, config);
                return response.data;
            } catch (error) {
                throw new Error(`GET request to ${endpoint} failed: ${error}`);
            }
        },
        getOne: async (endpoint, params = {}) => {
            try {
                const response = await client.get(endpoint, { params });
                return response.data;
            } catch (error) {
                throw new Error(`GET request to ${endpoint} failed: ${error}`);
            }
        },

        getMany: async (endpoint, params = {}) => {
            try {
                const response = await client.get(endpoint, { params });
                return response.data;
            } catch (error) {
                throw new Error(`GET request to ${endpoint} failed: ${error}`);
            }
        },

        post: async (endpoint, data) => {
            try {
                const response = await client.post(endpoint, data);
                return response.data;
            } catch (error) {
                throw new Error(`POST request to ${endpoint} failed: ${error}`);
            }
        },
        postMultipart: async (endpoint, formData) => {
            try {
                const response = await client.post(endpoint, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                return response.data;
            } catch (error) {
                throw new Error(`POST multipart request to ${endpoint} failed: ${error}`);
            }
        },
        put: async (endpoint, data) => {
            try {
                const response = await client.put(endpoint, data);
                return response.data;
            } catch (error) {
                throw new Error(`PUT request to ${endpoint} failed: ${error}`);
            }
        },

        delete: async (endpoint) => {
            try {
                const response = await client.delete(endpoint);
                return response.data;
            } catch (error) {
                throw new Error(`DELETE request to ${endpoint} failed: ${error}`);
            }
        },
    };
}

// Tạo một instance mặc định của API client
const axiosClient = createApiClient();

export default axiosClient;
