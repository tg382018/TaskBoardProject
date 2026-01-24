import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "@/app/api/projects.api";
import { DataTable } from "@/app/components/common/data-table";
import { Button, Badge } from "@packages/ui";
import { Plus, FileText } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { ProjectLogsModal } from "../components/ProjectLogsModal";
import { useAuth } from "@/app/hooks/use-auth";
import { useDebouncedValue } from "@/app/hooks/use-debounced-value";
import { PageHeader } from "@/app/components/common/page-header";
import { ProjectFilters } from "../components/ProjectFilters";

export default function ProjectsList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logsModalProjectId, setLogsModalProjectId] = useState(null);
    const { user } = useAuth();

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
        queryFn: () =>
            projectsApi.getAll({
                page,
                limit,
                search: debouncedSearch,
                sortBy,
                sortOrder,
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

    const columns = useMemo(
        () => [
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
                cell: ({ row }) =>
                    row.getValue("description") || (
                        <span className="text-muted-foreground italic">No description</span>
                    ),
            },
            {
                id: "source",
                header: "Source",
                enableSorting: false,
                cell: ({ row }) => {
                    const owner = row.original.ownerId;
                    const isOwner = user?._id === (owner?._id || owner);

                    if (isOwner) {
                        return (
                            <Badge
                                variant="outline"
                                className="bg-primary/5 text-primary border-primary/20"
                            >
                                You created
                            </Badge>
                        );
                    }

                    return (
                        <span className="text-sm text-muted-foreground">
                            Added by{" "}
                            <span className="font-medium text-foreground">
                                {owner?.name || owner?.email || "Unknown"}
                            </span>
                        </span>
                    );
                },
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
                    <Badge variant="secondary">{row.original.members?.length || 0} members</Badge>
                ),
            },
            {
                id: "logs",
                header: "Logs",
                enableSorting: false,
                cell: ({ row }) => {
                    const owner = row.original.ownerId;
                    const isOwner = user?._id === (owner?._id || owner);

                    if (!isOwner) return null;

                    return (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLogsModalProjectId(row.original._id)}
                        >
                            <FileText className="w-4 h-4 mr-1" />
                            Logs
                        </Button>
                    );
                },
            },
        ],
        [user]
    );

    return (
        <div className="space-y-6">
            <PageHeader title="Projects" description="Manage your teams and group your tasks.">
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                </Button>
            </PageHeader>

            <div className="bg-card rounded-lg border shadow-sm">
                {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <span className="text-muted-foreground animate-pulse">
                            Loading projects...
                        </span>
                    </div>
                ) : (
                    <div className="p-4 space-y-4">
                        <ProjectFilters
                            searchValue={searchInput}
                            onSearch={handleSearch}
                            limit={limit}
                            onLimitChange={(v) => {
                                setLimit(v);
                                setPage(1);
                            }}
                            sortBy={sortBy}
                            onSortChange={(v) => {
                                setSortBy(v);
                                setPage(1);
                            }}
                            sortOrder={sortOrder}
                            onSortOrderChange={(v) => {
                                setSortOrder(v);
                                setPage(1);
                            }}
                        />

                        <DataTable
                            columns={columns}
                            data={projects || []}
                            onSort={handleSort}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            enableColumnVisibility={true}
                            // Search and Limit moved to ProjectFilters
                        />

                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Showing {projects.length} results</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground mr-2">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <CreateProjectModal open={isModalOpen} onOpenChange={setIsModalOpen} />

            <ProjectLogsModal
                open={!!logsModalProjectId}
                onOpenChange={(open) => !open && setLogsModalProjectId(null)}
                projectId={logsModalProjectId}
            />
        </div>
    );
}
