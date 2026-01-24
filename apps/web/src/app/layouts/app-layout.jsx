import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/app/hooks/use-auth";
import { useUiStore } from "@/app/store/ui.store";
import { Button } from "@packages/ui";
import { LogOut, Home, FolderKanban, User, Menu } from "lucide-react";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@packages/ui";
import logo from "@/assets/logo.svg";

export default function AppLayout() {
    const { user, logout } = useAuth();
    const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center px-6 border-b">
                <Link
                    to="/"
                    className="flex items-center gap-2 font-semibold justify-center w-full"
                >
                    <img
                        src={logo}
                        alt="TaskBoard Logo"
                        className="h-12 w-auto invert dark:invert-0"
                    />
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium gap-2">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive("/") ? "bg-muted text-primary" : "text-muted-foreground"}`}
                    >
                        <Home className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        to="/projects"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive("/projects") ? "bg-muted text-primary" : "text-muted-foreground"}`}
                    >
                        <FolderKanban className="h-4 w-4" />
                        Projects
                    </Link>
                    <Link
                        to="/profile"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive("/profile") ? "bg-muted text-primary" : "text-muted-foreground"}`}
                    >
                        <User className="h-4 w-4" />
                        Profile
                    </Link>
                </nav>
            </div>
            <div className="mt-auto p-4 border-t">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-9 w-9 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                            {user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="text-sm font-medium truncate">{user?.name}</span>
                            <span className="text-xs text-muted-foreground truncate">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => logout()}
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 border-r bg-muted/40 md:flex flex-col">
                <SidebarContent />
            </aside>

            <div className="flex flex-col flex-1 h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 md:hidden justify-between">
                    <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                    <Link to="/" className="flex items-center gap-2 font-semibold">
                        <img
                            src={logo}
                            alt="TaskBoard Logo"
                            className="h-8 w-auto invert dark:invert-0"
                        />
                    </Link>
                    <div className="w-9"></div> {/* Spacer for centering if needed, or user menu */}
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="container py-6 md:py-10 max-w-7xl mx-auto px-4 md:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
