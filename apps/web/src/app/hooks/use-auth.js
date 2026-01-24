/**
 * Auth hook - wrapper around auth store
 * Re-exports auth state and actions for easy use in components
 */
import { useAuthStore } from "@/app/store/auth.store";

export function useAuth() {
    const { user, accessToken, refreshToken, isAuthenticated, setAuth, updateTokens, clearAuth } =
        useAuthStore();

    return {
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        isLoggedIn: !!accessToken,
        setAuth,
        updateTokens,
        logout: clearAuth,
    };
}

export default useAuth;
