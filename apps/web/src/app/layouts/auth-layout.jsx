import { Outlet, Link } from "react-router-dom";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import logo from "@/assets/logo.svg";
import { Button } from "@packages/ui";
import { BookOpen } from "lucide-react";

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/docs-public" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Docs</span>
                    </Link>
                </Button>
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
