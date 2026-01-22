import { useQuery } from "@tanstack/react-query";
import client from "@/api/client";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const columns = [
    {
        accessorKey: "title",
        header: "Project Name",
        cell: ({ row }) => {
            return (
                <Link to={`/projects/${row.original._id}`} className="font-medium hover:underline">
                    {row.getValue("title")}
                </Link>
            )
        }
    },
    {
        accessorKey: "description",
        header: "Description",
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
    const { data: projects, isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const res = await client.get("/projects");
            return res.data;
        },
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
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                </Button>
            </div>

            <div className="bg-card rounded-lg border shadow-sm">
                {isLoading ? (
                    <div className="h-24 flex items-center justify-center">Loading projects...</div>
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
        </div>
    );
}
