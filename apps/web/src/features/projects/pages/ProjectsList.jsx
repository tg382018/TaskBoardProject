import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projects.api";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { useAuthStore } from "@/store/auth.store";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export default function ProjectsList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuthStore();

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    // Server-side search
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebouncedValue(searchInput, 300);

    // Server-side sorting
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    const { data: response, isLoading } = useQuery({
        queryKey: ["projects", page, limit, debouncedSearch, sortBy, sortOrder],
        queryFn: () => projectsApi.getAll({
            page,
            limit,
            search: debouncedSearch,
            sortBy,
            sortOrder
        }),
    });

    const projects = response?.data || [];
    const meta = response?.meta || {};
    const totalPages = meta.totalPages || 1;

    const handleSearch = useCallback((value) => {
        setSearchInput(value);
        setPage(1); // Reset to first page on search
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

    const columns = useMemo(() => [
        {
            id: "title",
            accessorKey: "title",
            header: "Project Name",
            enableSorting: false, // Title search is via the search box
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
            id: "description",
            accessorKey: "description",
            header: "Description",
            enableSorting: false,
            cell: ({ row }) => row.getValue("description") || <span className="text-muted-foreground italic">No description</span>
        },
        {
            id: "source",
            header: "Source",
            enableSorting: false,
            cell: ({ row }) => {
                const owner = row.original.ownerId;
                const isOwner = user?._id === (owner?._id || owner);

                if (isOwner) {
                    return <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">You created</Badge>;
                }

                return (
                    <span className="text-sm text-muted-foreground">
                        Added by <span className="font-medium text-foreground">{owner?.name || owner?.email || "Unknown"}</span>
                    </span>
                );
            }
        },
        {
            id: "createdAt",
            accessorKey: "createdAt",
            header: "Created",
            enableSorting: true,
            cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy"),
        },
        {
            id: "members",
            header: "Members",
            enableSorting: true,
            cell: ({ row }) => (
                <Badge variant="secondary">
                    {row.original.members?.length || 0} members
                </Badge>
            ),
        },
    ], [user]);

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
                    <div className="p-4 space-y-4">
                        <DataTable
                            columns={columns}
                            data={projects || []}
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
                                    Page {page} of {totalPages}
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
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
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
