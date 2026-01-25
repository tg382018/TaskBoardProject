import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/app/hooks/use-auth";
import AuthLayout from "@/app/layouts/auth-layout";
import ProtectedRoute from "./protected";
import LoginPage from "@/app/features/auth/pages/Login";
import RegisterPage from "@/app/features/auth/pages/Register";
import ProjectsList from "@/app/features/projects/pages/ProjectsList";
import ProjectDetail from "@/app/features/projects/pages/ProjectDetail";
import TaskDetail from "@/app/features/tasks/pages/TaskDetail";
import ProfilePage from "@/app/features/profile/pages/Profile";
import DocsPage from "@/app/features/docs/Docs";
import { DailySummaryWidget } from "@/app/components/widgets/DailySummaryWidget";
import { UserStatsWidget } from "@/app/components/widgets/UserStatsWidget";
import { PageHeader } from "@/app/components/common/page-header";

// Dashboard with Daily Summary Widget and User Stats
const Dashboard = () => (
    <div className="space-y-6">
        <PageHeader
            title="Welcome back!"
            description="Select a project to get started with your tasks."
        />
        <UserStatsWidget />
        <DailySummaryWidget />
    </div>
);

function PublicRoute() {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? <AuthLayout /> : <Navigate to="/" replace />;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectsList />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/docs" element={<DocsPage />} />
            </Route>

            <Route path="/docs-public" element={<DocsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
