import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Shield, Smartphone, Laptop, LogOut, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ProfilePage() {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");

    const { data: profile, isLoading: isProfileLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: profileApi.getProfile,
        onSuccess: (data) => setName(data.name || ""),
    });

    const { data: sessions, isLoading: isSessionsLoading } = useQuery({
        queryKey: ["sessions"],
        queryFn: profileApi.getSessions,
    });

    const updateProfileMutation = useMutation({
        mutationFn: profileApi.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            alert("Profile updated successfully!");
        },
    });

    const revokeSessionMutation = useMutation({
        mutationFn: profileApi.revokeSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions"] });
        },
    });

    if (isProfileLoading) return <div className="p-8 text-center">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">Manage your profile and security sessions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Your public information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Display Name</Label>
                                <Input
                                    id="name"
                                    value={name || profile?.name || ""}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={profile?.email} disabled className="bg-muted" />
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => updateProfileMutation.mutate({ name })}
                                disabled={updateProfileMutation.isPending}
                            >
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Sessions */}
                <div className="md:col-span-2 space-y-6">
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
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isSessionsLoading ? (
                                        <TableRow><TableCell colSpan={3} className="text-center">Loading sessions...</TableCell></TableRow>
                                    ) : sessions?.map((session) => (
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
                                                        <span className="text-[10px] text-muted-foreground">{session.ipAddress}</span>
                                                    </div>
                                                    {session.isCurrent && (
                                                        <Badge variant="outline" className="text-[10px] h-4">Current</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {session.createdAt ? format(new Date(session.createdAt), "MMM d, HH:mm") : "Unknown"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {!session.isCurrent && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => revokeSessionMutation.mutate(session._id)}
                                                        disabled={revokeSessionMutation.isPending}
                                                    >
                                                        <LogOut className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
