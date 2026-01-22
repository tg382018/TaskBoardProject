import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@/app/providers/query-client";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { SocketProvider } from "@/app/providers/socket-provider";
import AppRoutes from "@/app/routes";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider>
                <ThemeProvider defaultTheme="dark" storageKey="taskboard-theme">
                    <SocketProvider>
                        <AppRoutes />
                    </SocketProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
