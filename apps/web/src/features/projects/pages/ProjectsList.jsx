import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projects.api";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { CreateProjectModal } from "../components/CreateProjectModal";

const columns = [
    {
        accessorKey: "title",
        header: "Project Name",
        cell: ({ row }) => {
            return (
                <Link
                    to={`/projects/${row.original._id}`}
                    className="font-medium hover:underline text-primary"
                >
                    {row.getValue("title")}
                </Link>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.getValue("description") || <span className="text-muted-foreground italic">No description</span>
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy"),
    },
    {
        id: "members",
        header: "Members",
        cell: ({ row }) => (
            <Badge variant="secondary">
                {row.original.members?.length || 0} members
            </Badge>
        ),
    },
];

export default function ProjectsList() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: projects, isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: projectsApi.getAll,
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage your teams and group your tasks.
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                </Button>
            </div>

            <div className="bg-card rounded-lg border shadow-sm">
                {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <span className="text-muted-foreground animate-pulse">Loading projects...</span>
                    </div>
                ) : (
                    <div className="p-4">
                        <DataTable
                            columns={columns}
                            data={projects || []}
                            searchKey="title"
                        />
                    </div>
                )}
            </div>

            <CreateProjectModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </div>
    );
}
