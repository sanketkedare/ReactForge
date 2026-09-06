import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("<Button /> Component", () => {
  it("renders with default props and text content", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDefined();
  });

  it("handles onClick events properly", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    const button = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables button when isLoading is true and sets aria-busy", () => {
    render(<Button isLoading>Saving</Button>);
    const button = screen.getByRole("button");
    expect(button.getAttribute("disabled")).not.toBeNull();
    expect(button.getAttribute("aria-busy")).toBe("true");
  });
});
