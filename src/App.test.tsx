import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("SprintBoard starting experience", () => {
  it("renders tasks in the expected status columns", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Todo" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "In progress" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Done" })).toBeVisible();
    expect(screen.getByText("Audit signup flow")).toBeVisible();
    expect(screen.getByText("Polish onboarding copy")).toBeVisible();
    expect(screen.getByText("Ship keyboard shortcuts")).toBeVisible();
  });

  it("filters active tasks and writes the filter to the URL", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /^Active/ }));

    expect(screen.queryByText("Ship keyboard shortcuts")).not.toBeInTheDocument();
    expect(screen.getByText("Audit signup flow")).toBeVisible();
    expect(new URLSearchParams(window.location.search).get("filter")).toBe("active");
  });

  it("filters completed tasks", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /^Done/ }));

    expect(screen.getByText("Ship keyboard shortcuts")).toBeVisible();
    expect(screen.queryByText("Audit signup flow")).not.toBeInTheDocument();
  });

  it("restores a supported filter from the URL", () => {
    window.history.replaceState({}, "", "/?filter=done");

    render(<App />);

    expect(screen.getByRole("button", { name: /^Done/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("Ship keyboard shortcuts")).toBeVisible();
    expect(screen.queryByText("Audit signup flow")).not.toBeInTheDocument();
  });

  it("filters at-risk tasks, shows the count, and writes the filter to the URL", () => {
    render(<App />);

    const atRisk = screen.getByRole("button", { name: /^At risk/ });
    expect(atRisk).toHaveTextContent("3");

    fireEvent.click(atRisk);

    expect(screen.getByText("Stabilize billing webhook")).toBeVisible();
    expect(screen.getByText("Audit signup flow")).toBeVisible();
    expect(screen.getByText("Refresh incident handbook")).toBeVisible();
    expect(screen.queryByText("Ship keyboard shortcuts")).not.toBeInTheDocument();
    expect(screen.queryByText("Simplify alert rules")).not.toBeInTheDocument();
    expect(new URLSearchParams(window.location.search).get("filter")).toBe("at-risk");
  });

  it("restores the at-risk filter from the URL", () => {
    window.history.replaceState({}, "", "/?filter=at-risk");

    render(<App />);

    expect(screen.getByRole("button", { name: /^At risk/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("Audit signup flow")).toBeVisible();
    expect(screen.queryByText("Ship keyboard shortcuts")).not.toBeInTheDocument();
  });

  it("opens details for a task with a due date", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Open Audit signup flow/ }));

    const details = screen.getByRole("dialog", { name: "Task details" });
    expect(within(details).getByRole("heading", { name: "Audit signup flow" })).toBeVisible();
    expect(within(details).getByText("Due")).toBeVisible();
    expect(within(details).getByText(/[A-Z][a-z]{2} \d{1,2}, \d{4}/)).toBeVisible();
  });

  it("opens details for a task without a due date", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Open Backfill release checklist/ }));

    const details = screen.getByRole("dialog", { name: "Task details" });
    expect(within(details).getByRole("heading", { name: "Backfill release checklist" })).toBeVisible();
    expect(within(details).getByText("Due")).toBeVisible();
    expect(within(details).getByText("No date")).toBeVisible();
  });

  it("exposes every filter as a named keyboard-reachable button", () => {
    render(<App />);

    const filters = screen.getByRole("group", { name: "Filter tasks" });
    const buttons = within(filters).getAllByRole("button");

    expect(buttons.map((button) => button.textContent)).toEqual([
      expect.stringMatching(/^All/),
      expect.stringMatching(/^Active/),
      expect.stringMatching(/^Done/),
      expect.stringMatching(/^At risk/),
    ]);
    for (const button of buttons) {
      expect(button).not.toHaveAttribute("tabindex", "-1");
    }
  });
});
