import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "@/app/api/tasks.api";
import { projectsApi } from "@/app/api/projects.api";
import { useAuth } from "@/app/hooks/use-auth";
import { Button, Badge, Input, Label } from "@packages/ui";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { ChevronLeft, Send, Clock, User as UserIcon, UserPlus, Check } from "lucide-react";
import { format } from "date-fns";
import { useSocketEvent } from "@/app/hooks/use-socket-event";
import { useSocket } from "@/app/hooks/use-socket";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { TaskStatus } from "@packages/common/constants";

import { CommentList } from "../components/CommentList";

export default function TaskDetail() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const socket = useSocket();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const {
        data: task,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["task", id],
        queryFn: () => tasksApi.getById(id),
        retry: false, // Don't retry on 403/500 unauthorized errors
    });

    const { data: project } = useQuery({
        queryKey: ["project", task?.projectId],
        queryFn: () => projectsApi.getById(task.projectId?._id || task.projectId),
        enabled: !!task?.projectId,
    });

    // Get proper projectId (might be populated object or string)
    const projectId = task?.projectId?._id || task?.projectId;

    // Join task/project room on mount
    useEffect(() => {
        if (socket && projectId) {
            socket.emit("project:join", projectId);
        }
    }, [socket, projectId]);

    // Real-time update logic - refetch query when events for this project occur
    useSocketEvent(
        "task.updated",
        useCallback(
            (data) => {
                const eventTaskId = String(data.taskId || data._id || "");
                const eventProjectId = String(data.projectId || "");
                if (eventTaskId === id || eventProjectId === projectId) {
                    queryClient.refetchQueries({ queryKey: ["task", id] });
                }
            },
            [id, projectId, queryClient]
        )
    );

    // Listen for new comments - data is nested: {type, projectId, data: {taskId, ...}}
    useSocketEvent(
        "comment.added",
        useCallback(
            (eventData) => {
                const payload = eventData.data || eventData;
                const eventTaskId = String(payload.taskId || "");
                if (eventTaskId === id) {
                    queryClient.refetchQueries({ queryKey: ["task", id] });
                }
            },
            [id, queryClient]
        )
    );

    const updateStatusMutation = useMutation({
        mutationFn: (status) => tasksApi.update(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["task", id] });
        },
    });

    const commentMutation = useMutation({
        mutationFn: (content) => tasksApi.addComment(id, content),
        onSuccess: () => {
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
            console.error(err.response?.data?.message || "Failed to delete task");
        },
    });

    const handleDeleteTask = () => {
        deleteTaskMutation.mutate();
    };

    if (isLoading) return <div className="p-8 text-center">Loading task...</div>;

    if (isError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Unknown error";
        const isUnauthorized =
            errorMessage.includes("authorized") || errorMessage.includes("Unauthorized");

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
                <Link
                    to={`/projects/${task.projectId?._id || task.projectId}`}
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
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
                                Are you sure you want to delete this task? This action cannot be
                                undone.
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
                            <span className="text-sm text-muted-foreground">
                                #{String(task._id).slice(-6)}
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">{task.title}</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            {task.description || "No description provided for this task."}
                        </p>
                        {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {task.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <CommentList
                        comments={task.comments || []}
                        onAddComment={(content) => commentMutation.mutate(content)}
                        isAddingComment={commentMutation.isPending}
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-card rounded-lg border p-6 space-y-6">
                        <div className="space-y-2">
                            <Label>Current Status</Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    {
                                        value: TaskStatus.TODO,
                                        label: "Todo",
                                        color: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300",
                                    },
                                    {
                                        value: TaskStatus.IN_PROGRESS,
                                        label: "In Progress",
                                        color: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300",
                                    },
                                    {
                                        value: TaskStatus.DONE,
                                        label: "Done",
                                        color: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300",
                                    },
                                ].map((s) => {
                                    const isSelected = task.status === s.value;
                                    return (
                                        <Button
                                            key={s.value}
                                            variant="ghost"
                                            size="sm"
                                            className={`justify-start ${isSelected ? s.color + " ring-2 ring-offset-2 ring-primary" : "text-muted-foreground hover:bg-secondary"}`}
                                            onClick={() => updateStatusMutation.mutate(s.value)}
                                            disabled={updateStatusMutation.isPending}
                                        >
                                            {isSelected && <Check className="w-3 h-3 mr-2" />}
                                            {s.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Details</Label>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Assignee</span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            asChild
                                            disabled={
                                                // Only allow if user is project owner OR task creator
                                                !user ||
                                                (user._id !==
                                                    (project?.ownerId?._id || project?.ownerId) &&
                                                    user._id !==
                                                        (task?.creatorId?._id || task?.creatorId))
                                            }
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`h-8 -mr-2 ${
                                                    !user ||
                                                    (user._id !==
                                                        (project?.ownerId?._id ||
                                                            project?.ownerId) &&
                                                        user._id !==
                                                            (task?.creatorId?._id ||
                                                                task?.creatorId))
                                                        ? "opacity-100 cursor-default hover:bg-transparent"
                                                        : ""
                                                }`}
                                            >
                                                <span className="font-medium flex items-center gap-1">
                                                    <UserIcon className="w-3 h-3" />
                                                    {task.assigneeId
                                                        ? task.assigneeId?.email ||
                                                          `User ${String(task.assigneeId?._id || task.assigneeId).slice(-4)}`
                                                        : "Unassigned"}
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Assign to...</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => assignMemberMutation.mutate(null)}
                                            >
                                                Unassigned
                                            </DropdownMenuItem>
                                            {project?.members
                                                ?.filter((member) => {
                                                    const memberId = member._id || member;
                                                    const ownerId =
                                                        project.ownerId?._id || project.ownerId;
                                                    return String(memberId) !== String(ownerId);
                                                })
                                                .map((member) => (
                                                    <DropdownMenuItem
                                                        key={member._id}
                                                        onClick={() =>
                                                            assignMemberMutation.mutate(member._id)
                                                        }
                                                    >
                                                        {member.email}
                                                    </DropdownMenuItem>
                                                ))}
                                            {project?.ownerId && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        assignMemberMutation.mutate(
                                                            project.ownerId._id || project.ownerId
                                                        )
                                                    }
                                                >
                                                    {project.ownerId.email || "Owner"} (Owner)
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created</span>
                                    <span className="font-medium">
                                        {format(new Date(task.createdAt), "MMM d")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
