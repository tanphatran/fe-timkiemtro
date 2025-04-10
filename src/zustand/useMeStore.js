import { create } from "zustand"; // Thêm dòng này

const useMeStore = create((set) => ({
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null, // Thêm refreshToken
    me: JSON.parse(localStorage.getItem("me")) || null,
    role: localStorage.getItem("role") || null,

    setToken: (token) => {
        localStorage.setItem("token", token);
        set(() => ({ token }));
    },
    setRefreshToken: (refreshToken) => { // Hàm lưu refreshToken
        localStorage.setItem("refreshToken", refreshToken);
        set(() => ({ refreshToken }));
    },
    setMe: (me) => {
        localStorage.setItem("me", JSON.stringify(me));
        set(() => ({ me }));
    },
    setRole: (role) => {
        localStorage.setItem("role", role);
        set(() => ({ role }));
    },
    clearAuth: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("me");
        localStorage.removeItem("role");
        set(() => ({ token: null, refreshToken: null, me: null, role: null }));
    },
}));

export default useMeStore;


