/**
 * Auth hook - wrapper around auth store
 * Re-exports auth state and actions for easy use in components
 */
import { useAuthStore } from "@/app/store/auth.store";

export function useAuth() {
    const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

    return {
        user,
        isAuthenticated,
        isLoggedIn: isAuthenticated,
        setAuth,
        logout: clearAuth,
    };
}

export default useAuth;
