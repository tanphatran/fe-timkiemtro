// // Code mới khi thêm notification
// src/apis/axiosClient.js
import axios from "axios";
import useMeStore from "@/zustand/useMeStore";

const baseURL = import.meta.env.VITE_API_URL;

function createApiClient() {
    const client = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Interceptor để thêm token
    client.interceptors.request.use(
        (config) => {
            const token = useMeStore.getState().token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Interceptor để xử lý response
    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Nếu lỗi 401 và chưa thử refresh token
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // Thử refresh token
                    const refreshToken = useMeStore.getState().refreshToken;
                    const response = await axios.post(`${baseURL}/auth/refresh-token`, {
                        refreshToken
                    });

                    const { token } = response.data;
                    useMeStore.getState().setToken(token);

                    // Thử lại request ban đầu với token mới
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return client(originalRequest);
                } catch (refreshError) {
                    // Nếu refresh token thất bại, logout
                    useMeStore.getState().logout();
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return {
        // Giữ lại các method cũ cho admin
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

        // Thêm các method mới cho notification
        get: async (endpoint, config = {}) => {
            try {
                const response = await client.get(endpoint, config);
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

const axiosClient = createApiClient();
export default axiosClient;

// Code cũ ban đầu chưa thêm notification
// const axiosClient = createApiClient();
// export default axiosClient;

// import axios from "axios";
// import useMeStore from "@/zustand/useMeStore"; // Lấy token từ zustand store

// const baseURL = import.meta.env.VITE_API_URL;

// function createApiClient() {
//     const client = axios.create({
//         baseURL,
//         //   withCredentials: true,
//         headers: {
//             "Content-Type": "application/json",
//         },
//     });

//     // Interceptor để thêm token vào tất cả các request
//     client.interceptors.request.use(
//         (config) => {
//             const token = useMeStore.getState().token;
//             console.log("Token trong request:", token); // Log để kiểm tra token
//             if (token) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             } else {
//                 console.warn("Không có token để gửi trong header Authorization");
//             }
//             return config;
//         },
//         (error) => Promise.reject(error)
//     );


//     return {
//         getOne: async (endpoint, params = {}) => {
//             try {
//                 const response = await client.get(endpoint, { params });
//                 return response.data;
//             } catch (error) {
//                 throw new Error(`GET request to ${endpoint} failed: ${error}`);
//             }
//         },

//         getMany: async (endpoint, params = {}) => {
//             try {
//                 const response = await client.get(endpoint, { params });
//                 return response.data;
//             } catch (error) {
//                 throw new Error(`GET request to ${endpoint} failed: ${error}`);
//             }
//         },

//         post: async (endpoint, data) => {
//             try {
//                 const response = await client.post(endpoint, data);
//                 return response.data;
//             } catch (error) {
//                 throw new Error(`POST request to ${endpoint} failed: ${error}`);
//             }
//         },

//         put: async (endpoint, data) => {
//             try {
//                 const response = await client.put(endpoint, data);
//                 return response.data;
//             } catch (error) {
//                 throw new Error(`PUT request to ${endpoint} failed: ${error}`);
//             }
//         },

//         delete: async (endpoint) => {
//             try {
//                 const response = await client.delete(endpoint);
//                 return response.data;
//             } catch (error) {
//                 throw new Error(`DELETE request to ${endpoint} failed: ${error}`);
//             }
//         },
//     };
// }

// // Tạo một instance mặc định của API client
// const axiosClient = createApiClient();

// export default axiosClient;
