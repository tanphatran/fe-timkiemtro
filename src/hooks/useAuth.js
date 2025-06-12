import { useEffect, useState } from "react";
import axios from "axios";
import useMeStore from "@/zustand/useMeStore";

const API_URL = import.meta.env.VITE_API_URL;

const useAuth = () => {
    const { token, refreshToken, setToken, setRefreshToken, clearAuth, setMe, setRole, me, id } = useMeStore();
    const [isLoggedIn, setIsLoggedIn] = useState(!!token);

    const refreshAccessToken = async () => {
        if (!refreshToken) {
            clearAuth();
            return null;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken,
            });

            if (response.data.status === "success") {
                const newAccessToken = response.data.data.accessToken;
                const newRefreshToken = response.data.data.refreshToken;
                setToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                return newAccessToken;
            } else {
                clearAuth();
                return null;
            }
        } catch (error) {
            console.error("Refresh token failed:", error);
            clearAuth();
            return null;
        }
    };

    const fetchMe = async () => {
        try {
            const res = await axios.get(`${API_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMe(res.data); // lưu me vào store
        } catch (error) {
            console.error("Fetch me failed:", error);
            clearAuth();
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            if (!token) {
                clearAuth();
                setIsLoggedIn(false);
                return;
            }

            try {
                await axios.post(`${API_URL}/auth/introspect`, { token });
                setIsLoggedIn(true);

                if (!me) {
                    await fetchMe(); // gọi getMe khi chưa có
                }
            } catch (error) {
                if (error?.response?.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        setIsLoggedIn(true);
                        await fetchMe();
                    } else {
                        setIsLoggedIn(false);
                    }
                } else {
                    clearAuth();
                    setIsLoggedIn(false);
                }
            }
        };

        checkLoginStatus();
    }, [token, refreshToken, me]);

    return { token, refreshToken, me, isLoggedIn, clearAuth, refreshAccessToken, id };
};

export default useAuth;
