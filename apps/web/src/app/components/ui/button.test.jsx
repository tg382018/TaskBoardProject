import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button Component", () => {
    it("renders with correct text", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("applies variant classes correctly", () => {
        const { container } = render(<Button variant="destructive">Delete</Button>);
        // Destructive variant has 'bg-destructive' class usually
        expect(container.firstChild).toHaveClass("bg-destructive");
    });
});
