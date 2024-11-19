import { create } from 'zustand'

const useMeStore = create((set) => ({
    token: null,
    me: null,
    setToken: (token) => set(() => ({ token })),
    setMe: (me) => set(() => ({ me })),
}));

export default useMeStore