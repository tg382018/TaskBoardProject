import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import logo from "@/assets/logo.svg";

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <img
                    src={logo}
                    alt="TaskBoard Logo"
                    className="mx-auto h-20 w-auto invert dark:invert-0"
                />
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Modern Project Management
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
