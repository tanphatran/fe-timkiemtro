import { create } from "zustand"; // Thêm dòng này

const useMeStore = create((set) => ({
    token: localStorage.getItem("token") || null,
    me: JSON.parse(localStorage.getItem("me")) || null,
    role: localStorage.getItem("role") || null, // Thêm role vào store
    setToken: (token) => {
        localStorage.setItem("token", token);
        set(() => ({ token }));
    },
    setMe: (me) => {
        localStorage.setItem("me", JSON.stringify(me));
        set(() => ({ me }));
    },
    setRole: (role) => { // Hàm lưu role
        localStorage.setItem("role", role);
        set(() => ({ role }));
    },
    clearAuth: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("me");
        localStorage.removeItem("role");
        set(() => ({ token: null, me: null, role: null }));
    },
}));

export default useMeStore;

