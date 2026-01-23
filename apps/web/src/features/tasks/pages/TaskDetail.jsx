import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Send, Clock, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import { useSocketEvent } from "@/hooks/use-socket-event";
import { useSocket } from "@/app/providers/socket-provider";

export default function TaskDetail() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const socket = useSocket();
    const [comment, setComment] = useState("");

    const { data: task, isLoading } = useQuery({
        queryKey: ["task", id],
        queryFn: () => tasksApi.getById(id),
    });

    // Join task/project room on mount
    useEffect(() => {
        if (socket && task?.projectId) {
            socket.emit("join:project", task.projectId);
        }
    }, [socket, task?.projectId]);

    // Real-time update logic
    useSocketEvent("task.updated", (updatedTask) => {
        if (updatedTask._id === id) {
            queryClient.setQueryData(["task", id], updatedTask);
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: (status) => tasksApi.update(id, { status }),
        onSuccess: (updatedTask) => {
            queryClient.setQueryData(["task", id], updatedTask);
        },
    });

    const commentMutation = useMutation({
        mutationFn: (content) => tasksApi.addComment(id, content),
        onSuccess: () => {
            setComment("");
            queryClient.invalidateQueries({ queryKey: ["task", id] });
        },
    });

    if (isLoading) return <div className="p-8 text-center">Loading task...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to={`/projects/${task.projectId}`} className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Project
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{task.priority.toUpperCase()}</Badge>
                            <span className="text-sm text-muted-foreground">#{task._id.slice(-6)}</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">{task.title}</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            {task.description || "No description provided for this task."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Activity & Comments
                        </h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {task.comments?.length ? (
                                task.comments.map((c, i) => (
                                    <div key={i} className="bg-muted p-4 rounded-lg space-y-1">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span className="font-semibold text-foreground">User {c.authorId?.slice(-4)}</span>
                                            <span>{format(new Date(c.createdAt), "HH:mm")}</span>
                                        </div>
                                        <p className="text-sm">{c.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground italic border-2 border-dashed rounded-lg">
                                    No comments yet. Start the conversation!
                                </div>
                            )}
                        </div>
                        <form
                            className="flex gap-2"
                            onSubmit={(e) => { e.preventDefault(); if (comment) commentMutation.mutate(comment); }}
                        >
                            <Input
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1"
                            />
                            <Button type="submit" disabled={commentMutation.isPending}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card rounded-lg border p-6 space-y-6">
                        <div className="space-y-2">
                            <Label>Current Status</Label>
                            <div className="grid grid-cols-1 gap-2">
                                {["todo", "inprogress", "done"].map((s) => (
                                    <Button
                                        key={s}
                                        variant={task.status === s ? "default" : "outline"}
                                        size="sm"
                                        className="justify-start capitalize"
                                        onClick={() => updateStatusMutation.mutate(s)}
                                        disabled={updateStatusMutation.isPending}
                                    >
                                        {s}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Details</Label>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Assignee</span>
                                    <span className="font-medium flex items-center gap-1">
                                        <UserIcon className="w-3 h-3" />
                                        {task.assigneeId ? `User ${task.assigneeId.slice(-4)}` : "None"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created</span>
                                    <span className="font-medium">{format(new Date(task.createdAt), "MMM d")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
