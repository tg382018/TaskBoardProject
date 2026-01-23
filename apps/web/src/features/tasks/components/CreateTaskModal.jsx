import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks.api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateTaskModal({ open, onOpenChange, projectId }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data) => tasksApi.create({ ...data, projectId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
            onOpenChange(false);
            setTitle("");
            setDescription("");
            setPriority("Medium");
        },
        onError: (err) => {
            alert(err.response?.data?.message || "Failed to create task");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { title, priority };
        if (description.trim()) {
            data.description = description.trim();
        }
        createMutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Design landing page"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a description for this task..."
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Priority</Label>
                        <div className="flex gap-2">
                            {["Low", "Medium", "High"].map((p) => (
                                <Button
                                    key={p}
                                    type="button"
                                    variant={priority === p ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPriority(p)}
                                    className="flex-1"
                                >
                                    {p}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? "Creating..." : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
