import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            setAuth: (data) =>
                set({
                    user: data.user,
                    isAuthenticated: !!data.user,
                }),

            clearAuth: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                }),

            updateTokens: () => {}, // No-op, managed by cookies
        }),
        {
            name: "taskboard-auth",
        }
    )
);
