import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/hooks/use-auth";
import AppLayout from "@/app/layouts/app-layout";

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />;
}
