import PropTypes from "prop-types";
import { FileX } from "lucide-react";
import { Button } from "@packages/ui";

/**
 * EmptyState - Displays when lists/tables are empty
 * Shows icon, message, and optional action button
 */
export function EmptyState({ icon: Icon = FileX, title, description, actionLabel, onAction }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground mt-1 max-w-md">{description}</p>
            )}
            {actionLabel && onAction && (
                <Button onClick={onAction} className="mt-4">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

EmptyState.propTypes = {
    icon: PropTypes.elementType,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    actionLabel: PropTypes.string,
    onAction: PropTypes.func,
};
