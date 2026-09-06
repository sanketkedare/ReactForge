import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "@/components/ui/Modal";

describe("<Modal /> Component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders when isOpen is true and shows title", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Confirm Action">
        <p>Are you sure?</p>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("Confirm Action")).toBeDefined();
  });

  it("calls onClose when Escape key is pressed", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Escape Test">
        <p>Modal body</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
