import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
    ScrollArea,
} from "@packages/ui";
import {
    FileText,
    Network,
    BookOpen,
    ChevronRight,
    Cpu,
    Activity,
    Database,
    Zap,
    ArrowLeft,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { docsContent } from "./content";

export default function DocsPage() {
    const [selectedDoc, setSelectedDoc] = useState(docsContent[0]);
    const location = useLocation();
    const isPublic = location.pathname === "/docs-public";

    const hubs = [
        {
            title: "Backend System",
            icon: <BookOpen className="h-4 w-4" />,
            categories: ["Backend", "Modules", "Infrastructure"],
        },
        {
            title: "Worker System",
            icon: <Cpu className="h-4 w-4" />,
            categories: ["Worker System", "Worker Consumers", "Worker Jobs", "Worker Models"],
        },
        {
            title: "Frontend",
            icon: <Activity className="h-4 w-4" />,
            categories: ["Frontend Core", "Frontend Features", "Frontend UI"],
        },
        {
            title: "Packages",
            icon: <Network className="h-4 w-4" />,
            categories: ["Packages"],
        },
    ];

    return (
        <div className="container mx-auto py-6 max-w-7xl h-[calc(100vh-4rem)]">
            {/* Back Button for Public Docs */}
            {isPublic && (
                <div className="mb-4">
                    <Link to="/login">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                {/* Sidebar */}
                <Card className="md:col-span-3 h-full flex flex-col overflow-hidden">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Database className="h-5 w-5 text-primary" />
                            Documentation
                        </CardTitle>
                        <CardDescription>Technical architecture & guides</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                        <ScrollArea className="h-full">
                            <div className="p-4 space-y-8">
                                {hubs.map((hub) => (
                                    <div key={hub.title} className="space-y-3">
                                        <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 flex items-center gap-2">
                                            {hub.icon}
                                            {hub.title}
                                        </h3>
                                        <div className="space-y-6 ml-1 border-l-2 border-slate-100 dark:border-slate-800 pointer-events-none">
                                            <div className="pointer-events-auto">
                                                {hub.categories.map((catName) => {
                                                    const items = docsContent.filter(
                                                        (d) => d.category === catName
                                                    );
                                                    if (items.length === 0) return null;

                                                    return (
                                                        <div
                                                            key={catName}
                                                            className="mt-4 first:mt-0"
                                                        >
                                                            <h4 className="mb-2 pl-4 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/40">
                                                                {catName === "Backend"
                                                                    ? "Core"
                                                                    : catName.replace(
                                                                          "Worker ",
                                                                          ""
                                                                      )}
                                                            </h4>
                                                            <div className="space-y-1 pl-3">
                                                                {items.map((doc) => (
                                                                    <Button
                                                                        key={doc.id}
                                                                        variant={
                                                                            selectedDoc.id ===
                                                                            doc.id
                                                                                ? "secondary"
                                                                                : "ghost"
                                                                        }
                                                                        className={`w-full justify-start h-8 px-2 transition-all duration-200 ${
                                                                            selectedDoc.id ===
                                                                            doc.id
                                                                                ? "bg-primary/10 text-primary font-semibold translate-x-1"
                                                                                : "hover:translate-x-1"
                                                                        }`}
                                                                        onClick={() =>
                                                                            setSelectedDoc(doc)
                                                                        }
                                                                    >
                                                                        {catName ===
                                                                            "Infrastructure" ||
                                                                        catName ===
                                                                            "Worker System" ? (
                                                                            <Network className="mr-2 h-3.5 w-3.5 shrink-0" />
                                                                        ) : catName.includes(
                                                                              "Consumers"
                                                                          ) ? (
                                                                            <Activity className="mr-2 h-3.5 w-3.5 shrink-0" />
                                                                        ) : catName.includes(
                                                                              "Jobs"
                                                                          ) ? (
                                                                            <Zap className="mr-2 h-3.5 w-3.5 shrink-0" />
                                                                        ) : (
                                                                            <FileText className="mr-2 h-3.5 w-3.5 shrink-0" />
                                                                        )}
                                                                        <span className="truncate text-[11px]">
                                                                            {doc.title}
                                                                        </span>
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Content Viewer */}
                <Card className="md:col-span-9 h-full flex flex-col overflow-hidden">
                    <CardHeader className="border-b bg-muted/20">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span>{selectedDoc.category}</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className="font-medium text-foreground">{selectedDoc.title}</span>
                        </div>
                        <CardTitle>{selectedDoc.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto p-8 lg:p-12">
                        <div
                            className="prose prose-slate dark:prose-invert max-w-none 
                            prose-headings:font-display prose-headings:tracking-tight
                            prose-h1:text-5xl prose-h1:font-extrabold prose-h1:mb-10 prose-h1:text-slate-900 dark:prose-h1:text-white
                            prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:pb-3 prose-h2:text-slate-800 dark:prose-h2:text-slate-200
                            prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-base
                            prose-li:text-slate-600 dark:prose-li:text-slate-400 prose-li:my-2
                            prose-hr:my-16 prose-hr:border-slate-200 dark:prose-hr:border-slate-800
                            prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold"
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    img: ({ node, ...props }) => (
                                        <div className="my-16 flex flex-col items-center">
                                            <div className="p-2 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl transition-all hover:scale-[1.02] w-[85%]">
                                                <img
                                                    {...props}
                                                    className="w-full h-auto rounded-xl mx-auto"
                                                    alt={props.alt || ""}
                                                />
                                            </div>
                                            {props.alt && (
                                                <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                                    {props.alt}
                                                </p>
                                            )}
                                        </div>
                                    ),
                                    blockquote: ({ node, ...props }) => {
                                        const content = props.children[0]?.props?.children || "";
                                        const isAlert =
                                            typeof content === "string" && content.startsWith("[!");

                                        if (isAlert) {
                                            const type = content.match(/\[!(.*?)\]/)?.[1] || "NOTE";
                                            const text = content.replace(/\[!.*?\]\n?/, "");
                                            const colors = {
                                                NOTE: "border-blue-500 bg-blue-50/50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
                                                IMPORTANT:
                                                    "border-amber-500 bg-amber-50/50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
                                                TIP: "border-emerald-500 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
                                                CAUTION:
                                                    "border-rose-500 bg-rose-50/50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300",
                                            };
                                            return (
                                                <div
                                                    className={`my-8 p-5 rounded-xl border-l-4 shadow-sm ${colors[type]}`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1 text-[11px] font-black uppercase tracking-widest opacity-70">
                                                        <span>{type}</span>
                                                    </div>
                                                    <div className="text-sm font-medium leading-relaxed">
                                                        {text}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="my-8 p-6 rounded-xl border-l-4 border-slate-300 bg-slate-50 dark:bg-slate-900/50 italic text-slate-500">
                                                {props.children}
                                            </div>
                                        );
                                    },
                                    table: ({ node, ...props }) => (
                                        <div className="my-10 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                                            <table
                                                className="w-full text-sm text-left border-collapse"
                                                {...props}
                                            />
                                        </div>
                                    ),
                                    th: ({ node, ...props }) => (
                                        <th
                                            className="bg-slate-50 dark:bg-slate-800/50 p-4 font-bold border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                                            {...props}
                                        />
                                    ),
                                    td: ({ node, ...props }) => (
                                        <td
                                            className="p-4 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                                            {...props}
                                        />
                                    ),
                                }}
                            >
                                {selectedDoc.content}
                            </ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
