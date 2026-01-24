import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./Login";

// Create a client for testing
const queryClient = new QueryClient();

// Mock hooks if necessary (e.g., useAuthStore)
vi.mock("@/store/auth.store", () => ({
    useAuthStore: () => ({
        login: vi.fn(),
        isAuthenticated: false,
    }),
}));

// Mock API
vi.mock("@/api/auth.api", () => ({
    authApi: {
        login: vi.fn(),
    },
}));

describe("Login Page", () => {
    it("renders login form correctly", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </QueryClientProvider>
        );

        // Check for specific elements present in the actual login form
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    });

    it("allows entering email", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </QueryClientProvider>
        );

        const emailInput = screen.getByLabelText(/email address/i);
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        expect(emailInput.value).toBe("test@example.com");
    });
});
