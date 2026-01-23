import { useState, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api/projects.api";
import { tasksApi } from "../../tasks/api/tasks.api";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserPlus, Plus, ChevronLeft, Check, X, Pencil } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "../../../store/auth.store";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useToast } from "@/hooks/use-toast";

export default function ProjectDetail() {
    const { id } = useParams();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast();

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

    // Inline edit state
    const [editingCell, setEditingCell] = useState(null); // { rowId, field }
    const [editValue, setEditValue] = useState("");

    const { data: project, isLoading: isProjectLoading } = useQuery({
        queryKey: ["project", id],
        queryFn: () => projectsApi.getById(id),
    });

    const { data: tasks, isLoading: isTasksLoading } = useQuery({
        queryKey: ["project-tasks", id, page, limit, debouncedSearch, filterAssignee, filterTag, sortBy, sortOrder],
        queryFn: () => tasksApi.getAll(id, {
            page,
            limit,
            search: debouncedSearch,
            assigneeId: filterAssignee || undefined,
            tag: filterTag || undefined,
            sortBy,
            sortOrder
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
        }
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ taskId, data }) => tasksApi.update(taskId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-tasks", id], refetchType: "all" });
            setEditingCell(null);
            setEditValue("");
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
        }
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

    const canEditTask = (task) => {
        if (!user) return false;
        const isProjectOwner = user._id === (project?.ownerId?._id || project?.ownerId);
        const isTaskCreator = user._id === (task.creatorId?._id || task.creatorId);
        return isProjectOwner || isTaskCreator;
    };

    const startEditing = (rowId, field, currentValue) => {
        setEditingCell({ rowId, field });
        setEditValue(currentValue || "");
    };

    const cancelEditing = () => {
        setEditingCell(null);
        setEditValue("");
    };

    const saveEditing = (taskId) => {
        if (!editingCell) return;
        const data = { [editingCell.field]: editValue };
        updateTaskMutation.mutate({ taskId, data });
    };

    const isProjectOwner = user?._id === (project?.ownerId?._id || project?.ownerId);

    const columns = useMemo(() => [
        {
            id: "title",
            accessorKey: "title",
            header: "Task",
            enableSorting: false,
            cell: ({ row }) => {
                const task = row.original;
                const isEditing = editingCell?.rowId === task._id && editingCell?.field === "title";
                const editable = canEditTask(task);

                if (isEditing) {
                    return (
                        <div className="flex items-center gap-1">
                            <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-7 text-sm"
                                autoFocus
                            />
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => saveEditing(task._id)}>
                                <Check className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEditing}>
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    );
                }

                return (
                    <div className="flex items-center gap-2 group">
                        <Link to={`/tasks/${task._id}`} className="font-medium hover:underline">
                            {task.title}
                        </Link>
                        {editable && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-muted-foreground opacity-50 hover:opacity-100"
                                onClick={() => startEditing(task._id, "title", task.title)}
                                title="Edit task title"
                            >
                                <Pencil className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                );
            },
        },
        {
            id: "status",
            accessorKey: "status",
            header: "Status",
            enableSorting: true,
            cell: ({ row }) => {
                const task = row.original;
                const status = task.status;
                const isEditing = editingCell?.rowId === task._id && editingCell?.field === "status";
                const editable = canEditTask(task);

                if (isEditing) {
                    return (
                        <div className="flex items-center gap-1">
                            <Select value={editValue} onValueChange={setEditValue}>
                                <SelectTrigger className="h-7 w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todo">Todo</SelectItem>
                                    <SelectItem value="InProgress">In Progress</SelectItem>
                                    <SelectItem value="Done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => saveEditing(task._id)}>
                                <Check className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEditing}>
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    );
                }

                const variants = {
                    Todo: "secondary",
                    InProgress: "default",
                    Done: "outline",
                };
                return (
                    <div
                        className={`flex items-center gap-2 ${editable ? "cursor-pointer group" : ""}`}
                        onClick={() => editable && startEditing(task._id, "status", status)}
                    >
                        <Badge variant={variants[status] || "secondary"}>{status}</Badge>
                        {editable && (
                            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </div>
                );
            },
        },
        {
            id: "priority",
            accessorKey: "priority",
            header: "Priority",
            enableSorting: true,
            cell: ({ row }) => {
                const priority = row.getValue("priority");
                const colors = {
                    High: "text-destructive",
                    Medium: "text-orange-500",
                    Low: "text-green-500",
                };
                return <span className={`font-medium ${colors[priority]}`}>{priority}</span>;
            },
        },
        {
            id: "assigneeId",
            header: "Assignee",
            enableSorting: false,
            cell: ({ row }) => {
                const task = row.original;
                const assignee = task.assigneeId;
                const isEditing = editingCell?.rowId === task._id && editingCell?.field === "assigneeId";
                const editable = canEditTask(task);

                if (isEditing) {
                    return (
                        <div className="flex items-center gap-1">
                            <Select value={editValue || "__none__"} onValueChange={(v) => setEditValue(v === "__none__" ? "" : v)}>
                                <SelectTrigger className="h-7 w-28">
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__none__">Unassigned</SelectItem>
                                    {project?.members?.map((member) => (
                                        <SelectItem key={member._id} value={member._id}>
                                            {member.name || member.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => saveEditing(task._id)}>
                                <Check className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEditing}>
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    );
                }

                return (
                    <div
                        className={editable ? "cursor-pointer" : ""}
                        onClick={() => editable && startEditing(task._id, "assigneeId", assignee?._id || "")}
                    >
                        {assignee ? (
                            <span className="text-sm">{assignee.name || assignee.email}</span>
                        ) : (
                            <span className="text-muted-foreground text-sm italic">Unassigned</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "tags",
            header: "Tags",
            enableSorting: false,
            cell: ({ row }) => {
                const tags = row.original.tags || [];
                if (tags.length === 0) return <span className="text-muted-foreground italic text-sm">-</span>;
                return (
                    <div className="flex flex-wrap gap-1">
                        {tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{tags.length - 3}</span>
                        )}
                    </div>
                );
            },
        },
    ], [editingCell, editValue, project, user]);

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
                    <p className="text-muted-foreground">{project.description || "Project management dashboard."}</p>
                </div>
                <div className="flex items-center gap-2">
                    {isProjectOwner && (
                        <>
                            <Button variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/50" onClick={() => setIsDeleteDialogOpen(true)} disabled={deleteProjectMutation.isPending}>
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
                    <div className="bg-card rounded-lg border shadow-sm p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Tasks</h3>
                            <div className="flex items-center gap-2">
                                <Select value={filterAssignee || "__all__"} onValueChange={(v) => { setFilterAssignee(v === "__all__" ? "" : v); setPage(1); }}>
                                    <SelectTrigger className="h-8 w-32 text-xs">
                                        <SelectValue placeholder="All Assignees" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">All Assignees</SelectItem>
                                        {project?.members?.map((member) => (
                                            <SelectItem key={member._id} value={member._id}>
                                                {member.name || member.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="Filter by tag..."
                                    value={filterTag}
                                    onChange={(e) => { setFilterTag(e.target.value); setPage(1); }}
                                    className="h-8 w-28 text-xs"
                                />
                            </div>
                        </div>
                        {isTasksLoading ? (
                            <div className="h-24 flex items-center justify-center">Loading tasks...</div>
                        ) : (
                            <div className="space-y-4">
                                <DataTable
                                    columns={columns}
                                    data={tasks?.data || []}
                                    onSearch={handleSearch}
                                    searchValue={searchInput}
                                    onSort={handleSort}
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    enableColumnVisibility={true}
                                />

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Per page:</span>
                                        <select
                                            className="h-8 w-16 rounded-md border border-input bg-background px-2 text-xs"
                                            value={limit}
                                            onChange={(e) => {
                                                setLimit(Number(e.target.value));
                                                setPage(1);
                                            }}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={15}>15</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground mr-2">
                                            Page {page} of {tasks?.meta?.totalPages || 1}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(tasks?.meta?.totalPages || 1, p + 1))}
                                            disabled={page === (tasks?.meta?.totalPages || 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card rounded-lg border shadow-sm p-4">
                        <h3 className="text-lg font-medium mb-4">Members</h3>
                        <div className="space-y-3">
                            {project.members?.map((member) => {
                                const isMemberOwner = (member._id || member) === (project.ownerId?._id || project.ownerId);
                                return (
                                    <div key={member._id || member} className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                            {(member.name || member.email || "?").substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                {member.name || "No Name"}
                                                {isMemberOwner && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Owner</span>}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{member.email}</span>
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
                            Are you sure you want to delete this project? This action cannot be undone.
                            All tasks associated with this project will also be deleted.
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
