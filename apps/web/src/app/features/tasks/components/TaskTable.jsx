import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button, Badge, Input } from "@packages/ui";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import { Check, X, Pencil } from "lucide-react";
import { DataTable } from "@/app/components/common/data-table";
import { TaskStatus } from "@packages/common/constants";

export function TaskTable({
    tasks,
    project,
    user,
    isLoading,
    // Filter & Sort State
    searchInput,
    onSearch,
    sortBy,
    sortOrder,
    onSort,
    filterAssignee,
    onFilterAssigneeChange,
    filterTag,
    onFilterTagChange,
    limit,
    onLimitChange,
    page,
    totalPages,
    onPageChange,
    // Actions
    onTaskUpdate,
}) {
    // Inline edit state
    const [editingCell, setEditingCell] = useState(null); // { rowId, field }
    const [editValue, setEditValue] = useState("");

    const canEditTask = useCallback(
        (task) => {
            if (!user) return false;
            const isProjectOwner = user._id === (project?.ownerId?._id || project?.ownerId);
            const isTaskCreator = user._id === (task.creatorId?._id || task.creatorId);
            return isProjectOwner || isTaskCreator;
        },
        [user, project]
    );

    const startEditing = useCallback((rowId, field, currentValue) => {
        setEditingCell({ rowId, field });
        setEditValue(currentValue || "");
    }, []);

    const cancelEditing = useCallback(() => {
        setEditingCell(null);
        setEditValue("");
    }, []);

    const saveEditing = useCallback(
        (taskId) => {
            if (!editingCell) return;
            const data = { [editingCell.field]: editValue };
            onTaskUpdate(taskId, data);
            setEditingCell(null);
            setEditValue("");
        },
        [editingCell, editValue, onTaskUpdate]
    );

    const columns = useMemo(
        () => [
            {
                id: "title",
                accessorKey: "title",
                header: "Task",
                enableSorting: false,
                cell: ({ row }) => {
                    const task = row.original;
                    const isEditing =
                        editingCell?.rowId === task._id && editingCell?.field === "title";
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
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => saveEditing(task._id)}
                                >
                                    <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={cancelEditing}
                                >
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
                    const isEditing =
                        editingCell?.rowId === task._id && editingCell?.field === "status";
                    const editable = canEditTask(task);

                    if (isEditing) {
                        return (
                            <div className="flex items-center gap-1">
                                <Select value={editValue} onValueChange={setEditValue}>
                                    <SelectTrigger className="h-7 w-28">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                                            In Progress
                                        </SelectItem>
                                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => saveEditing(task._id)}
                                >
                                    <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={cancelEditing}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        );
                    }

                    const statusColors = {
                        [TaskStatus.TODO]:
                            "bg-slate-100 text-slate-700 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-300",
                        [TaskStatus.IN_PROGRESS]:
                            "bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900 dark:text-blue-300",
                        [TaskStatus.DONE]:
                            "bg-green-100 text-green-700 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-300",
                    };
                    const badgeClass =
                        statusColors[status] || "bg-secondary text-secondary-foreground";

                    return (
                        <div
                            className={`flex items-center gap-2 ${editable ? "cursor-pointer group" : ""}`}
                            onClick={() => editable && startEditing(task._id, "status", status)}
                        >
                            <Badge variant="outline" className={`border-0 ${badgeClass}`}>
                                {status}
                            </Badge>
                            {editable && (
                                <Pencil className="h-3 w-3 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
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
                    const isEditing =
                        editingCell?.rowId === task._id && editingCell?.field === "assigneeId";
                    const editable = canEditTask(task);

                    if (isEditing) {
                        return (
                            <div className="flex items-center gap-1">
                                <Select
                                    value={editValue || "__none__"}
                                    onValueChange={(v) => setEditValue(v === "__none__" ? "" : v)}
                                >
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
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => saveEditing(task._id)}
                                >
                                    <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={cancelEditing}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        );
                    }

                    return (
                        <div
                            className={`flex items-center gap-2 ${editable ? "cursor-pointer group" : ""}`}
                            onClick={() =>
                                editable &&
                                startEditing(task._id, "assigneeId", assignee?._id || "")
                            }
                        >
                            {assignee ? (
                                <span className="text-sm">{assignee.name || assignee.email}</span>
                            ) : (
                                <span className="text-muted-foreground text-sm italic">
                                    Unassigned
                                </span>
                            )}
                            {editable && (
                                <Pencil className="h-3 w-3 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
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
                    if (tags.length === 0)
                        return <span className="text-muted-foreground italic text-sm">-</span>;
                    return (
                        <div className="flex flex-wrap gap-1">
                            {tags.slice(0, 3).map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                    +{tags.length - 3}
                                </span>
                            )}
                        </div>
                    );
                },
            },
        ],
        [editingCell, editValue, project, canEditTask, saveEditing, startEditing, cancelEditing]
    );

    return (
        <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Tasks</h3>
                <div className="flex items-center gap-2">
                    <Select
                        value={filterAssignee || "__all__"}
                        onValueChange={(v) => onFilterAssigneeChange(v === "__all__" ? "" : v)}
                    >
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
                        onChange={(e) => onFilterTagChange(e.target.value)}
                        className="h-8 w-28 text-xs"
                    />
                </div>
            </div>
            {isLoading ? (
                <div className="h-24 flex items-center justify-center">Loading tasks...</div>
            ) : (
                <div className="space-y-4">
                    <DataTable
                        columns={columns}
                        data={tasks || []}
                        onSearch={(v) => onSearch(v)}
                        searchValue={searchInput}
                        onSort={onSort}
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
                                onChange={(e) => onLimitChange(Number(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground mr-2">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(Math.max(1, page - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
