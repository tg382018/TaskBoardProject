import { format } from "date-fns";
import { Shield, Smartphone, Laptop } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@packages/ui";

export function SessionsTable({ sessions, isLoading }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Active Sessions
                </CardTitle>
                <CardDescription>Devices currently logged into your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Device / IP</TableHead>
                            <TableHead>Last Seen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center">
                                    Loading sessions...
                                </TableCell>
                            </TableRow>
                        ) : (
                            sessions?.map((session) => (
                                <TableRow key={session._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {session.userAgent?.toLowerCase().includes("mobi") ? (
                                                <Smartphone className="w-4 h-4 text-muted-foreground" />
                                            ) : (
                                                <Laptop className="w-4 h-4 text-muted-foreground" />
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-medium text-xs truncate max-w-[150px]">
                                                    {session.userAgent || "Unknown Device"}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {session.ipAddress}
                                                </span>
                                            </div>
                                            {session.isCurrent && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] h-4"
                                                >
                                                    Current
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {session.createdAt
                                            ? format(new Date(session.createdAt), "MMM d, HH:mm")
                                            : "Unknown"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
