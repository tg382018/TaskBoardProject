import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projects.api";
import { tasksApi } from "../../tasks/api/tasks.api";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Plus, ChevronLeft } from "lucide-react";
import { MemberInviteModal } from "../components/MemberInviteModal";
import { CreateTaskModal } from "../../tasks/components/CreateTaskModal";

const columns = [
    {
        accessorKey: "title",
        header: "Task",
        cell: ({ row }) => (
            <Link to={`/tasks/${row.original._id}`} className="font-medium hover:underline">
                {row.getValue("title")}
            </Link>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status");
            const variants = {
                todo: "secondary",
                inprogress: "default",
                done: "outline",
            };
            return <Badge variant={variants[status] || "secondary"}>{status.toUpperCase()}</Badge>;
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.getValue("priority");
            const colors = {
                high: "text-destructive",
                medium: "text-orange-500",
                low: "text-green-500",
            };
            return <span className={`font-medium ${colors[priority]}`}>{priority.toUpperCase()}</span>;
        },
    },
];

import { useAuthStore } from "../../../store/auth.store";

export default function ProjectDetail() {
    const { id } = useParams();
    const { user } = useAuthStore();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const { data: project, isLoading: isProjectLoading } = useQuery({
        queryKey: ["project", id],
        queryFn: () => projectsApi.getById(id),
    });

    const { data: tasks, isLoading: isTasksLoading } = useQuery({
        queryKey: ["project-tasks", id],
        queryFn: () => tasksApi.getAll(id),
    });

    const navigate = useNavigate();

    const deleteProjectMutation = useMutation({
        mutationFn: () => projectsApi.delete(id),
        onSuccess: () => {
            navigate("/projects");
        },
        onError: (err) => {
            alert(err.response?.data?.message || "Failed to delete project");
        }
    });

    const handleDeleteProject = () => {
        if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            deleteProjectMutation.mutate();
        }
    };

    if (isProjectLoading) {
        return <div className="h-64 flex items-center justify-center">Loading project...</div>;
    }

    const isProjectOwner = user?._id === (project.ownerId?._id || project.ownerId);

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
                            <Button variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/50" onClick={handleDeleteProject} disabled={deleteProjectMutation.isPending}>
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
                        <h3 className="text-lg font-medium mb-4">Tasks</h3>
                        {isTasksLoading ? (
                            <div className="h-24 flex items-center justify-center">Loading tasks...</div>
                        ) : (
                            <DataTable columns={columns} data={tasks || []} searchKey="title" />
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
        </div>
    );
}
