import { useEffect, useState } from "react";
import axios from "axios";
import useMeStore from "@/zustand/useMeStore";

const useAuth = () => {
    const { token, me, setToken, setMe, clearAuth } = useMeStore((state) => state);
    const [isLoggedIn, setIsLoggedIn] = useState(!!token); // Kiểm tra đăng nhập ban đầu

    useEffect(() => {
        const checkLoginStatus = async () => {
            if (!token) {
                clearAuth(); // Nếu không có token, đăng xuất
                setIsLoggedIn(false);
                return;
            }

            try {
                const response = await axios.post("http://localhost:8080/api/auth/introspect", {
                    token,
                });

                console.log("Response data 1:", response.data.data.valid);

                if (response.data.data.valid) {
                    setIsLoggedIn(true);


                } else {
                    clearAuth();
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Lỗi kiểm tra trạng thái đăng nhập", error);
                clearAuth();
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, [token, clearAuth]);

    return { token, me, isLoggedIn, clearAuth };
};

export default useAuth;
