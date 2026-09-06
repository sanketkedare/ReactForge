import { describe, it, expect } from "vitest";

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

describe("Core Utilities & Formatters", () => {
  it("formats minutes into clean readable strings", () => {
    expect(formatMinutes(15)).toBe("15m");
    expect(formatMinutes(60)).toBe("1h");
    expect(formatMinutes(75)).toBe("1h 15m");
  });

  it("slugifies text into URL-safe strings", () => {
    expect(slugify("100k Virtual Kanban")).toBe("100k-virtual-kanban");
    expect(slugify("Undo / Redo (useHistory)")).toBe("undo-redo-usehistory");
    expect(slugify("  Spaces & Special !! Characters ")).toBe("spaces-special-characters");
  });
});
