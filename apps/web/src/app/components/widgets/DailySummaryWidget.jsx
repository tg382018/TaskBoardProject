import { useQuery } from "@tanstack/react-query";
import client from "@/app/api/client";
import { Card, CardHeader, CardTitle, CardContent } from "@packages/ui";
import { ScrollArea } from "@packages/ui";
import { formatDistanceToNow, format } from "date-fns";
import { Activity, CheckCircle, MessageSquare, Users, TrendingUp, FileEdit } from "lucide-react";

const usersApi = {
    getDailySummary: () => client.get("/users/daily-summary").then((res) => res.data),
};

const EVENT_ICONS = {
    task_created: <TrendingUp className="w-4 h-4 text-green-500" />,
    task_updated: <FileEdit className="w-4 h-4 text-blue-500" />,
    status_changed: <CheckCircle className="w-4 h-4 text-purple-500" />,
    title_changed: <FileEdit className="w-4 h-4 text-orange-500" />,
    comment_added: <MessageSquare className="w-4 h-4 text-yellow-500" />,
    member_added: <Users className="w-4 h-4 text-cyan-500" />,
    project_created: <TrendingUp className="w-4 h-4 text-emerald-500" />,
};

export function DailySummaryWidget() {
    const { data: summaries, isLoading } = useQuery({
        queryKey: ["daily-summary"],
        queryFn: usersApi.getDailySummary,
    });

    const latestSummary = summaries?.[0];
    const activities = latestSummary?.activities || [];

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-primary" />
                    Your Daily Activity Summary
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Your 24-hour activity history is logged here every day at 00:00
                </p>
                {latestSummary?.date && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Last summary: {format(new Date(latestSummary.date), "MMMM d, yyyy")}
                    </p>
                )}
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                        Loading...
                    </div>
                ) : !latestSummary || activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                        <Activity className="w-8 h-8 mb-2 opacity-50" />
                        <p>No activity summary yet</p>
                        <p className="text-xs">Summaries are generated daily at 00:00</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[280px]">
                        <div className="space-y-2">
                            {activities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="mt-0.5">
                                        {EVENT_ICONS[activity.eventType] || (
                                            <Activity className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">{activity.message}</p>
                                        {activity.taskTitle && (
                                            <p className="text-xs text-primary font-medium">
                                                Task: {activity.taskTitle}
                                            </p>
                                        )}
                                        {activity.timestamp && (
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(activity.timestamp), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
