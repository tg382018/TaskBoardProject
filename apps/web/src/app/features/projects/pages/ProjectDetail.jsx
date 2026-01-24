import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/app/api/projects.api";
import { tasksApi } from "@/app/api/tasks.api";
import { TaskTable } from "../../tasks/components/TaskTable";
import { Button } from "@packages/ui";
import { UserPlus, Plus, ChevronLeft } from "lucide-react";
import { MemberInviteModal } from "../components/MemberInviteModal";
import { CreateTaskModal } from "../../tasks/components/CreateTaskModal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@packages/ui";
import { useAuth } from "@/app/hooks/use-auth";
import { useDebouncedValue } from "@/app/hooks/use-debounced-value";
import { useToast } from "@/app/hooks/use-toast";
import { useSocket } from "@/app/hooks/use-socket";
import { useSocketEvent } from "@/app/hooks/use-socket-event";
import { TaskStatus } from "@packages/common/constants";

export default function ProjectDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast();
    const socket = useSocket();

    // Join project room for realtime updates
    useEffect(() => {
        if (socket && id) {
            socket.emit("project:join", id);
        }
    }, [socket, id]);

    // Realtime socket event handlers - invalidate task list when events occur
    useSocketEvent(
        "task.created",
        useCallback(
            (data) => {
                if (data.projectId === id) {
                    queryClient.invalidateQueries({ queryKey: ["project-tasks", id] });
                }
            },
            [id, queryClient]
        )
    );

    useSocketEvent(
        "task.updated",
        useCallback(
            (data) => {
                if (data.projectId === id) {
                    queryClient.invalidateQueries({ queryKey: ["project-tasks", id] });
                }
            },
            [id, queryClient]
        )
    );

    useSocketEvent(
        "task.deleted",
        useCallback(
            (data) => {
                if (data.projectId === id) {
                    queryClient.invalidateQueries({ queryKey: ["project-tasks", id] });
                }
            },
            [id, queryClient]
        )
    );

    // Modal states
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    // Server-side search and filters
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebouncedValue(searchInput, 500);
    const [filterAssignee, setFilterAssignee] = useState("");
    const [filterTag, setFilterTag] = useState("");

    // Sorting
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    const { data: project, isLoading: isProjectLoading } = useQuery({
        queryKey: ["project", id],
        queryFn: () => projectsApi.getById(id),
    });

    const { data: tasks, isLoading: isTasksLoading } = useQuery({
        queryKey: [
            "project-tasks",
            id,
            page,
            limit,
            debouncedSearch,
            filterAssignee,
            filterTag,
            sortBy,
            sortOrder,
        ],
        queryFn: () =>
            tasksApi.getAll(id, {
                page,
                limit,
                search: debouncedSearch,
                assigneeId: filterAssignee || undefined,
                tag: filterTag || undefined,
                sortBy,
                sortOrder,
            }),
    });

    const deleteProjectMutation = useMutation({
        mutationFn: () => projectsApi.delete(id),
        onSuccess: () => {
            navigate("/projects");
        },
        onError: (err) => {
            toast({
                variant: "destructive",
                title: "Delete failed",
                description: err.response?.data?.message || "Failed to delete project",
            });
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ taskId, data }) => tasksApi.update(taskId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-tasks", id], refetchType: "all" });
            toast({
                title: "Task updated",
                description: "Changes saved successfully.",
            });
        },
        onError: (err) => {
            toast({
                variant: "destructive",
                title: "Update failed",
                description: err.response?.data?.message || "Failed to update task",
            });
        },
    });

    const handleSearch = useCallback((value) => {
        setSearchInput(value);
        setPage(1);
    }, []);

    const handleSort = useCallback((column, order) => {
        if (column === null) {
            setSortBy("createdAt");
            setSortOrder("desc");
        } else {
            setSortBy(column);
            setSortOrder(order);
        }
        setPage(1);
    }, []);

    const handleDeleteProject = () => {
        deleteProjectMutation.mutate();
    };

    const isProjectOwner = user?._id === (project?.ownerId?._id || project?.ownerId);

    if (isProjectLoading) {
        return <div className="h-64 flex items-center justify-center">Loading project...</div>;
    }

    return (
        <div className="space-y-6">
            <Link
                to="/projects"
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Projects
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                    <p className="text-muted-foreground">
                        {project.description || "Project management dashboard."}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {isProjectOwner && (
                        <>
                            <Button
                                variant="outline"
                                className="text-destructive hover:bg-destructive/10 border-destructive/50"
                                onClick={() => setIsDeleteDialogOpen(true)}
                                disabled={deleteProjectMutation.isPending}
                            >
                                Delete Project
                            </Button>
                            <Button variant="outline" onClick={() => setIsInviteModalOpen(true)}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Invite
                            </Button>
                        </>
                    )}
                    <Button onClick={() => setIsTaskModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <TaskTable
                        tasks={tasks?.data || []}
                        project={project}
                        user={user}
                        isLoading={isTasksLoading}
                        searchInput={searchInput}
                        onSearch={handleSearch}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        filterAssignee={filterAssignee}
                        onFilterAssigneeChange={(v) => {
                            setFilterAssignee(v);
                            setPage(1);
                        }}
                        filterTag={filterTag}
                        onFilterTagChange={(v) => {
                            setFilterTag(v);
                            setPage(1);
                        }}
                        limit={limit}
                        onLimitChange={(v) => {
                            setLimit(v);
                            setPage(1);
                        }}
                        page={page}
                        totalPages={tasks?.meta?.totalPages || 1}
                        onPageChange={setPage}
                        onTaskUpdate={(taskId, data) => updateTaskMutation.mutate({ taskId, data })}
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-card rounded-lg border shadow-sm p-4">
                        <h3 className="text-lg font-medium mb-4">Members</h3>
                        <div className="space-y-3">
                            {project.members?.map((member) => {
                                const isMemberOwner =
                                    (member._id || member) ===
                                    (project.ownerId?._id || project.ownerId);
                                return (
                                    <div
                                        key={member._id || member}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                            {(member.name || member.email || "?")
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                {member.name || "No Name"}
                                                {isMemberOwner && (
                                                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                                        Owner
                                                    </span>
                                                )}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {member.email}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <MemberInviteModal
                open={isInviteModalOpen}
                onOpenChange={setIsInviteModalOpen}
                projectId={id}
            />

            <CreateTaskModal
                open={isTaskModalOpen}
                onOpenChange={setIsTaskModalOpen}
                projectId={id}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this project? This action cannot be
                            undone. All tasks associated with this project will also be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDeleteProject}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
