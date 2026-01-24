import { useState, useMemo } from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@packages/ui";
import { Button } from "@packages/ui";
import { Input } from "@packages/ui";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@packages/ui";
import { ArrowUpDown, ArrowUp, ArrowDown, Settings2 } from "lucide-react";

export function DataTable({
    columns,
    data,
    // Server-side callbacks
    onSearch,
    searchValue = "",
    onSort,
    sortBy,
    sortOrder,
    // Column visibility
    enableColumnVisibility = false,
    // Inline edit
    enableInlineEdit = false,
    onInlineEdit,
    editableColumns = [],
    canEditRow,
}) {
    const [columnVisibility, setColumnVisibility] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnVisibility,
        },
    });

    const SortableHeader = ({ column, children }) => {
        const isSorted = sortBy === column.id;
        const isAsc = isSorted && sortOrder === "asc";
        const isDesc = isSorted && sortOrder === "desc";

        const handleSort = () => {
            if (!onSort) return;
            if (!isSorted) {
                onSort(column.id, "asc");
            } else if (isAsc) {
                onSort(column.id, "desc");
            } else {
                // Toggle back to asc instead of clearing
                onSort(column.id, "asc");
            }
        };

        return (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={handleSort}
            >
                {children}
                {isAsc ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : isDesc ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                )}
            </Button>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                {onSearch && (
                    <Input
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => onSearch(e.target.value)}
                        className="max-w-sm"
                    />
                )}
                {enableColumnVisibility && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-auto">
                                <Settings2 className="mr-2 h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const canSort =
                                        header.column.columnDef.enableSorting !== false && onSort;
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : canSort ? (
                                                <SortableHeader column={header.column}>
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </SortableHeader>
                                            ) : (
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
