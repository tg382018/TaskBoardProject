import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks.api";
import { projectsApi } from "../../projects/api/projects.api";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, Send, Clock, User as UserIcon, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { useSocketEvent } from "@/hooks/use-socket-event";
import { useSocket } from "@/app/providers/socket-provider";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TaskDetail() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const socket = useSocket();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [comment, setComment] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { data: task, isLoading, isError, error } = useQuery({
        queryKey: ["task", id],
        queryFn: () => tasksApi.getById(id),
        retry: false, // Don't retry on 403/500 unauthorized errors
    });

    const { data: project } = useQuery({
        queryKey: ["project", task?.projectId],
        queryFn: () => projectsApi.getById(task.projectId?._id || task.projectId),
        enabled: !!task?.projectId,
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["task", id] });
        },
    });

    const commentMutation = useMutation({
        mutationFn: (content) => tasksApi.addComment(id, content),
        onSuccess: () => {
            setComment("");
            queryClient.invalidateQueries({ queryKey: ["task", id] });
        },
    });

    const assignMemberMutation = useMutation({
        mutationFn: (assigneeId) => tasksApi.update(id, { assigneeId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["task", id] });
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: () => tasksApi.delete(id),
        onSuccess: () => {
            // Navigate back to project page
            navigate(-1);
        },
        onError: (err) => {
            alert(err.response?.data?.message || "Failed to delete task");
        }
    });

    const handleDeleteTask = () => {
        deleteTaskMutation.mutate();
    };

    if (isLoading) return <div className="p-8 text-center">Loading task...</div>;

    if (isError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Unknown error";
        const isUnauthorized = errorMessage.includes("authorized") || errorMessage.includes("Unauthorized");

        return (
            <div className="max-w-md mx-auto mt-16 p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🔒</span>
                </div>
                <h2 className="text-xl font-semibold">
                    {isUnauthorized ? "Access Denied" : "Error Loading Task"}
                </h2>
                <p className="text-muted-foreground">
                    {isUnauthorized
                        ? "Owner has not authorized you for this task. You need to be assigned to this task or be the project owner to view it."
                        : errorMessage}
                </p>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Project
                </Button>
            </div>
        );
    }

    const isProjectOwner = user?._id === (project?.ownerId?._id || project?.ownerId);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link to={`/projects/${task.projectId?._id || task.projectId}`} className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Project
                </Link>

                {isProjectOwner && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 border-destructive/50"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={deleteTaskMutation.isPending}
                    >
                        Delete Task
                    </Button>
                )}

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this task? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={handleDeleteTask}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{String(task.priority).toUpperCase()}</Badge>
                            <span className="text-sm text-muted-foreground">#{String(task._id).slice(-6)}</span>
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
                                            <span className="font-semibold text-foreground">
                                                {c.authorId?.email || `User ${String(c.authorId?._id || c.authorId || "").slice(-4)}`}
                                            </span>
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
                                {[
                                    { value: "Todo", label: "Todo" },
                                    { value: "InProgress", label: "In Progress" },
                                    { value: "Done", label: "Done" }
                                ].map((s) => (
                                    <Button
                                        key={s.value}
                                        variant={task.status === s.value ? "default" : "outline"}
                                        size="sm"
                                        className="justify-start"
                                        onClick={() => updateStatusMutation.mutate(s.value)}
                                        disabled={updateStatusMutation.isPending}
                                    >
                                        {s.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Details</Label>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Assignee</span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild disabled={
                                            // Only allow if user is project owner OR task creator
                                            !user || (
                                                user._id !== (project?.ownerId?._id || project?.ownerId) &&
                                                user._id !== (task?.creatorId?._id || task?.creatorId)
                                            )
                                        }>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`h-8 -mr-2 ${(!user || (
                                                    user._id !== (project?.ownerId?._id || project?.ownerId) &&
                                                    user._id !== (task?.creatorId?._id || task?.creatorId)
                                                )) ? "opacity-100 cursor-default hover:bg-transparent" : ""
                                                    }`}
                                            >
                                                <span className="font-medium flex items-center gap-1">
                                                    <UserIcon className="w-3 h-3" />
                                                    {task.assigneeId
                                                        ? (task.assigneeId?.email || `User ${String(task.assigneeId?._id || task.assigneeId).slice(-4)}`)
                                                        : "Unassigned"}
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Assign to...</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => assignMemberMutation.mutate(null)}>
                                                Unassigned
                                            </DropdownMenuItem>
                                            {project?.members?.filter(member => {
                                                const memberId = member._id || member;
                                                const ownerId = project.ownerId?._id || project.ownerId;
                                                return String(memberId) !== String(ownerId);
                                            }).map((member) => (
                                                <DropdownMenuItem
                                                    key={member._id}
                                                    onClick={() => assignMemberMutation.mutate(member._id)}
                                                >
                                                    {member.email}
                                                </DropdownMenuItem>
                                            ))}
                                            {project?.ownerId && (
                                                <DropdownMenuItem
                                                    onClick={() => assignMemberMutation.mutate(project.ownerId._id || project.ownerId)}
                                                >
                                                    {project.ownerId.email || "Owner"} (Owner)
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
