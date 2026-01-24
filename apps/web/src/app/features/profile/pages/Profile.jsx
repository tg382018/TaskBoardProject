import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/app/api/profile.api";
import { Button } from "@packages/ui";
import { Input } from "@packages/ui";
import { Label } from "@packages/ui";
import { useToast } from "@/app/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@packages/ui";
import { Badge } from "@packages/ui";
import { format } from "date-fns";
import { SessionsTable } from "../components/SessionsTable";

export default function ProfilePage() {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");

    const { toast } = useToast();

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
            toast({
                title: "Profile updated",
                description: "Your profile information has been updated successfully.",
            });
        },
        onError: (err) => {
            toast({
                variant: "destructive",
                title: "Update failed",
                description: err.response?.data?.message || "Failed to update profile",
            });
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
                    <SessionsTable sessions={sessions} isLoading={isSessionsLoading} />
                </div>
            </div>
        </div>
    );
}
