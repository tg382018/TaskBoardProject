import { useState } from "react";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { Button } from "@packages/ui";
import { Input } from "@packages/ui";

export function CommentList({ comments, onAddComment, isAddingComment }) {
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            onAddComment(comment);
            setComment("");
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">Activity & Comments</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {comments?.length ? (
                    comments.map((c, i) => (
                        <div key={i} className="bg-muted p-4 rounded-lg space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    {c.authorId?.email ||
                                        `User ${String(c.authorId?._id || c.authorId || "").slice(-4)}`}
                                </span>
                                <span>{format(new Date(c.createdAt), "HH:mm")}</span>
                            </div>
                            <p className="text-sm">{c.content}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground italic border-2 border-dashed rounded-lg">
                        No comments yet. Start the conversation!
                    </div>
                )}
            </div>
            <form className="flex gap-2" onSubmit={handleSubmit}>
                <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1"
                />
                <Button type="submit" disabled={isAddingComment || !comment.trim()}>
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
