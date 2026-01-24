import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/app/api/stats.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@packages/ui";
import { Skeleton } from "@packages/ui";
import { FolderPlus, FolderMinus, ListPlus, ListMinus, UserCheck } from "lucide-react";

export function UserStatsWidget() {
    const {
        data: stats,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["user-stats"],
        queryFn: statsApi.getMyStats,
        staleTime: 0, // Always consider data stale
        refetchOnMount: "always", // Always refetch when component mounts
    });

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Statistics</CardTitle>
                    <CardDescription className="text-destructive">
                        Failed to load statistics
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const statItems = [
        {
            label: "Projects Created",
            value: stats?.projectsCreated ?? 0,
            icon: FolderPlus,
            color: "text-amber-800",
            bgColor: "bg-amber-100 dark:bg-amber-900/30",
        },
        {
            label: "Tasks Created",
            value: stats?.tasksCreated ?? 0,
            icon: ListPlus,
            color: "text-amber-700",
            bgColor: "bg-amber-50 dark:bg-amber-800/30",
        },
        {
            label: "Tasks Assigned",
            value: stats?.tasksAssigned ?? 0,
            icon: UserCheck,
            color: "text-yellow-700",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        },
        {
            label: "Projects Deleted",
            value: stats?.projectsDeleted ?? 0,
            icon: FolderMinus,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50 dark:bg-yellow-800/30",
        },
        {
            label: "Tasks Deleted",
            value: stats?.tasksDeleted ?? 0,
            icon: ListMinus,
            color: "text-amber-500",
            bgColor: "bg-orange-50 dark:bg-orange-800/20",
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
                <CardDescription>Track your activity across projects and tasks</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {statItems.map((item) => (
                        <div
                            key={item.label}
                            className={`flex flex-col items-center p-4 rounded-lg ${item.bgColor}`}
                        >
                            {isLoading ? (
                                <>
                                    <Skeleton className="h-8 w-8 rounded-full mb-2" />
                                    <Skeleton className="h-6 w-12 mb-1" />
                                    <Skeleton className="h-4 w-20" />
                                </>
                            ) : (
                                <>
                                    <item.icon className={`h-8 w-8 mb-2 ${item.color}`} />
                                    <span className="text-2xl font-bold">{item.value}</span>
                                    <span className="text-xs text-muted-foreground text-center">
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
