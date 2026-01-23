import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api/projects.api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MemberInviteModal({ open, onOpenChange, projectId }) {
    const [email, setEmail] = useState("");
    const queryClient = useQueryClient();

    const inviteMutation = useMutation({
        mutationFn: (email) => projectsApi.addMember(projectId, email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            onOpenChange(false);
            setEmail("");
        },
        onError: (err) => {
            alert(err.response?.data?.message || "Failed to invite member");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            inviteMutation.mutate(email);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                        Enter the email address of the person you want to invite to this project.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={inviteMutation.isPending}>
                            {inviteMutation.isPending ? "Inviting..." : "Invite"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
