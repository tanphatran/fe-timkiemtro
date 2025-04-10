import { create } from "zustand";
import { persist } from "zustand/middleware";

const useActiveButtonStore = create(
    persist(
        (set) => ({
            activeButton: null,
            setActiveButton: (buttonName) => set({ activeButton: buttonName }),
            resetActiveButton: () => set({ activeButton: null }),
        }),
        {
            name: "active-button-store", // key trong localStorage
        }
    )
);

export default useActiveButtonStore;
