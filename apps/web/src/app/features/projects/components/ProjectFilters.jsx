import { Input } from "@packages/ui";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui";

export function ProjectFilters({
    searchValue,
    onSearch,
    limit,
    onLimitChange,
    sortBy,
    onSortChange,
    sortOrder,
    onSortOrderChange,
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search projects..."
                    value={searchValue}
                    onChange={(e) => onSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">Date Created</SelectItem>
                        <SelectItem value="title">Name</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={onSortOrderChange}>
                    <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Newest First</SelectItem>
                        <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={String(limit)} onValueChange={(v) => onLimitChange(Number(v))}>
                    <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 / page</SelectItem>
                        <SelectItem value="10">10 / page</SelectItem>
                        <SelectItem value="15">15 / page</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
