import { Input } from "@packages/ui";
import { Search } from "lucide-react";

export function ProjectFilters({ searchValue, onSearch }) {
    return (
        <div className="flex items-center">
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search projects..."
                    value={searchValue}
                    onChange={(e) => onSearch(e.target.value)}
                    className="pl-9"
                />
            </div>
        </div>
    );
}
