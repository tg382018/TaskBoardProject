import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projects.api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

const EVENT_COLORS = {
    "task.created": "bg-green-500",
    "task.updated": "bg-blue-500",
    "task.deleted": "bg-red-500",
    "task.assigned": "bg-purple-500",
    "comment.added": "bg-yellow-500",
    "comment.deleted": "bg-orange-500",
    "otp.requested": "bg-gray-500",
};

function formatChanges(changes) {
    if (!changes || typeof changes !== "object") return null;

    const parts = [];
    if (changes.title) parts.push(`title → "${changes.title}"`);
    if (changes.status) parts.push(`status → ${changes.status}`);
    if (changes.priority) parts.push(`priority → ${changes.priority}`);
    if (changes.assigneeId) parts.push("assignee changed");
    if (changes.description) parts.push("description updated");

    return parts.length > 0 ? parts.join(", ") : "task properties";
}

function formatEventMessage(event) {
    const type = event.type;
    const payload = event.payload || {};

    switch (type) {
        case "task.created":
            return {
                action: "Created task",
                detail: payload.title ? `"${payload.title}"` : null,
            };
        case "task.updated":
            return {
                action: "Updated task",
                detail: formatChanges(payload.changes),
            };
        case "task.deleted":
            return {
                action: "Deleted task",
                detail: payload.title ? `"${payload.title}"` : null,
            };
        case "comment.added":
            return {
                action: "Added comment",
                detail: payload.content ? `"${payload.content}..."` : null,
            };
        case "comment.deleted":
            return {
                action: "Deleted comment",
                detail: null,
            };
        default:
            return {
                action: type,
                detail: null,
            };
    }
}

export function ProjectLogsModal({ open, onOpenChange, projectId }) {
    const { data: logs, isLoading } = useQuery({
        queryKey: ["project-logs", projectId],
        queryFn: () => projectsApi.getLogs(projectId),
        enabled: open && !!projectId,
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Project Activity Logs</DialogTitle>
                    <DialogDescription>Last 50 events in this project</DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[400px] pr-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                            Loading...
                        </div>
                    ) : !logs?.length ? (
                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                            No activity yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log, index) => {
                                const { action, detail } = formatEventMessage(log);
                                return (
                                    <div
                                        key={log._id || index}
                                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                                    >
                                        <div
                                            className={`w-2 h-2 mt-2 rounded-full ${EVENT_COLORS[log.type] || "bg-gray-400"}`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {log.type}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {log.processedAt
                                                        ? formatDistanceToNow(
                                                              new Date(log.processedAt),
                                                              { addSuffix: true }
                                                          )
                                                        : ""}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium">{action}</p>
                                            {detail && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {detail}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
