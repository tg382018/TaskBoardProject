/**
 * @packages/ui - Shared UI Components
 * Barrel exports for all UI components
 */

// Utilities
export { cn } from "./src/lib/cn.js";

// Button
export { Button, buttonVariants } from "./src/components/button.jsx";

// Input & Label
export { Input } from "./src/components/input.jsx";
export { Label } from "./src/components/label.jsx";

// Badge
export { Badge, badgeVariants } from "./src/components/badge.jsx";

// Skeleton
export { Skeleton } from "./src/components/skeleton.jsx";

// Card
export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
} from "./src/components/card.jsx";

// Table
export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from "./src/components/table.jsx";

// Dialog
export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "./src/components/dialog.jsx";

// AlertDialog
export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from "./src/components/alert-dialog.jsx";

// DropdownMenu
export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
} from "./src/components/dropdown-menu.jsx";

// Select
export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
} from "./src/components/select.jsx";

// Sheet
export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
} from "./src/components/sheet.jsx";

// Scroll Area
export { ScrollArea, ScrollBar } from "./src/components/scroll-area.jsx";

// Toast (primitives only - Toaster needs local hook)
export {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
    ToastAction,
} from "./src/components/toast.jsx";
