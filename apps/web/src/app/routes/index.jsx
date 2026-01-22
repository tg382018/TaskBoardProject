import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import AuthLayout from "@/layouts/auth-layout";
import AppLayout from "@/layouts/app-layout";
import LoginPage from "@/features/auth/pages/Login";

// Placeholder for Dashboard (Part of Auth Core verification)
const Dashboard = () => (
    <div className="space-y-4">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Select a project to get started with your tasks.</p>
    </div>
);

function ProtectedRoute() {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
    const { isAuthenticated } = useAuthStore();
    return !isAuthenticated ? <AuthLayout /> : <Navigate to="/" replace />;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                {/* Other features will follow in B4 */}
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
