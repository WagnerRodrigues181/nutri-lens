import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InsightCard from "@/components/insights/InsightCard";
import type { Insight } from "@/types";

describe("InsightCard", () => {
  it("should render success insight", () => {
    const insight: Insight = {
      id: "1",
      type: "success",
      message: "Meta atingida!",
      timestamp: new Date().toISOString(),
    };

    render(<InsightCard insight={insight} />);

    expect(screen.getByText("Meta atingida!")).toBeInTheDocument();
  });

  it("should render warning insight", () => {
    const insight: Insight = {
      id: "2",
      type: "warning",
      message: "Atenção: Baixo consumo de proteína",
      timestamp: new Date().toISOString(),
    };

    const { container } = render(<InsightCard insight={insight} />);

    expect(screen.getByText(/Baixo consumo de proteína/)).toBeInTheDocument();
    expect(container.querySelector(".border-amber-200")).toBeInTheDocument();
  });

  it("should render info insight", () => {
    const insight: Insight = {
      id: "3",
      type: "info",
      message: "Lembre-se de beber água",
      timestamp: new Date().toISOString(),
    };

    const { container } = render(<InsightCard insight={insight} />);

    expect(screen.getByText("Lembre-se de beber água")).toBeInTheDocument();
    expect(container.querySelector(".border-blue-200")).toBeInTheDocument();
  });

  it("should render achievement insight", () => {
    const insight: Insight = {
      id: "4",
      type: "achievement",
      message: "Dia perfeito!",
      timestamp: new Date().toISOString(),
    };

    const { container } = render(<InsightCard insight={insight} />);

    expect(screen.getByText("Dia perfeito!")).toBeInTheDocument();
    expect(container.querySelector(".border-purple-200")).toBeInTheDocument();
  });

  it("should render custom icon when provided", () => {
    const insight: Insight = {
      id: "5",
      type: "success",
      message: "Parabéns!",
      icon: "🎉",
      timestamp: new Date().toISOString(),
    };

    render(<InsightCard insight={insight} />);

    expect(screen.getByText("🎉")).toBeInTheDocument();
  });
});
