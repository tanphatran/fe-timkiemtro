// apiClient.js
// import getTokenFromCookies from "@utils/getCookie";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

function createApiClient() {
    const client = axios.create({
        baseURL,
        // timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Interceptor to add the token to every request
    // client.interceptors.request.use(
    //   (config) => {
    //     const token = getTokenFromCookies();
    //     if (token) {
    //       config.headers["Authorization"] = `Bearer ${token}`;
    //     }
    //     return config;
    //   },
    //   (error) => Promise.reject(error)
    // );

    return {
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

// Create a default instance of the API client
const axiosClient = createApiClient();

export default axiosClient;
