import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import Login from "./Login";

// Create a fresh client for each test
const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

// Mock toast hook
vi.mock("@/app/hooks/use-toast", () => ({
    useToast: () => ({
        toast: vi.fn(),
    }),
}));

// Mock axios client
const mockPost = vi.fn();
vi.mock("@/app/api/client", () => ({
    default: {
        post: (...args) => mockPost(...args),
    },
}));

// Helper to render with providers
const renderLogin = () => {
    const queryClient = createTestQueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </QueryClientProvider>
    );
};

describe("Login Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Rendering", () => {
        it("renders login form with all required elements", () => {
            renderLogin();

            expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
            expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
        });

        it("has a link to registration page", () => {
            renderLogin();

            const registerLink = screen.getByRole("link", { name: /sign up/i });
            expect(registerLink).toHaveAttribute("href", "/register");
        });

        it("shows Powered by TaskBoard text", () => {
            renderLogin();

            expect(screen.getByText(/powered by taskboard/i)).toBeInTheDocument();
        });
    });

    describe("Form Interaction", () => {
        it("allows entering email address", async () => {
            const user = userEvent.setup();
            renderLogin();

            const emailInput = screen.getByLabelText(/email address/i);

            await act(async () => {
                await user.type(emailInput, "test@example.com");
            });

            expect(emailInput).toHaveValue("test@example.com");
        });

        it("allows entering password", async () => {
            const user = userEvent.setup();
            renderLogin();

            const passwordInput = screen.getByLabelText(/password/i);

            await act(async () => {
                await user.type(passwordInput, "password123");
            });

            expect(passwordInput).toHaveValue("password123");
        });

        it("submit button shows Continue text initially", () => {
            renderLogin();

            const submitButton = screen.getByRole("button", { name: /continue/i });
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toHaveTextContent("Continue");
        });

        it("enables submit button when form is valid", async () => {
            const user = userEvent.setup();
            renderLogin();

            const emailInput = screen.getByLabelText(/email address/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const submitButton = screen.getByRole("button", { name: /continue/i });

            await act(async () => {
                await user.type(emailInput, "valid@email.com");
                await user.type(passwordInput, "password123");
            });

            await waitFor(() => {
                expect(submitButton).not.toBeDisabled();
            });
        });
    });

    describe("Validation", () => {
        it("shows error for invalid email format", async () => {
            const user = userEvent.setup();
            renderLogin();

            const emailInput = screen.getByLabelText(/email address/i);

            await act(async () => {
                await user.type(emailInput, "invalid-email");
                await user.tab(); // Trigger blur
            });

            await waitFor(() => {
                expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
            });
        });

        it("shows error when password is too short", async () => {
            const user = userEvent.setup();
            renderLogin();

            const passwordInput = screen.getByLabelText(/password/i);

            await act(async () => {
                await user.type(passwordInput, "12345"); // 5 chars, min is 6
                await user.tab();
            });

            await waitFor(() => {
                expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
            });
        });
    });

    describe("Form Submission", () => {
        it("calls login API on valid form submission", async () => {
            mockPost.mockResolvedValueOnce({ data: { pendingOtp: true } });

            const user = userEvent.setup();
            renderLogin();

            await act(async () => {
                await user.type(screen.getByLabelText(/email address/i), "test@example.com");
                await user.type(screen.getByLabelText(/password/i), "password123");
            });

            await waitFor(() => {
                expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
            });

            await act(async () => {
                await user.click(screen.getByRole("button", { name: /continue/i }));
            });

            await waitFor(() => {
                expect(mockPost).toHaveBeenCalledWith("/auth/login", {
                    email: "test@example.com",
                    password: "password123",
                });
            });
        });

        it("shows OTP form after successful login", async () => {
            mockPost.mockResolvedValueOnce({ data: { pendingOtp: true } });

            const user = userEvent.setup();
            renderLogin();

            await act(async () => {
                await user.type(screen.getByLabelText(/email address/i), "test@example.com");
                await user.type(screen.getByLabelText(/password/i), "password123");
            });

            await waitFor(() => {
                expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
            });

            await act(async () => {
                await user.click(screen.getByRole("button", { name: /continue/i }));
            });

            // After successful login, OTP form should be shown
            await waitFor(() => {
                expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
            });
        });
    });
});
