import { Outlet, Navigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { LogOut, Home, FolderKanban, User } from "lucide-react";

export default function AppLayout() {
    const { user, clearAuth } = useAuthStore();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-6 md:gap-10">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="inline-block font-bold">TaskBoard</span>
                        </Link>
                        <nav className="flex gap-6 text-sm font-medium">
                            <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Dashboard</Link>
                            <Link to="/projects" className="transition-colors hover:text-foreground/80 text-foreground/60">Projects</Link>
                            <Link to="/profile" className="transition-colors hover:text-foreground/80 text-foreground/60">Profile</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mr-4">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <span>{user?.name || user?.email}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => clearAuth()}>
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container py-6">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t py-6 md:px-8 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    </p>
                </div>
            </footer>
        </div>
    );
}
