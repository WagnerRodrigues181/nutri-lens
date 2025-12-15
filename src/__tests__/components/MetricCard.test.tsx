import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MetricCard from "@/components/dashboard/MetricCard";
import { Flame } from "lucide-react";

describe("MetricCard", () => {
  it("should render metric label and values", () => {
    render(
      <MetricCard
        icon={Flame}
        label="Calorias"
        value="1800"
        goal="2000"
        progress={90}
        color="green"
      />
    );

    expect(screen.getByText("Calorias")).toBeInTheDocument();
    expect(screen.getByText("1800")).toBeInTheDocument();
    expect(screen.getByText("/ 2000")).toBeInTheDocument();
  });

  it("should display progress percentage", () => {
    render(
      <MetricCard
        icon={Flame}
        label="Calorias"
        value="1800"
        goal="2000"
        progress={90}
        color="green"
      />
    );

    expect(screen.getByText("90%")).toBeInTheDocument();
  });

  it("should render with different colors", () => {
    const { container } = render(
      <MetricCard
        icon={Flame}
        label="Proteína"
        value="120"
        goal="150"
        progress={80}
        color="red"
      />
    );

    expect(container.querySelector(".text-red-600")).toBeInTheDocument();
  });

  it("should show progress at 100% correctly", () => {
    render(
      <MetricCard
        icon={Flame}
        label="Calorias"
        value="2000"
        goal="2000"
        progress={100}
        color="green"
      />
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("should handle progress over 100%", () => {
    render(
      <MetricCard
        icon={Flame}
        label="Calorias"
        value="2200"
        goal="2000"
        progress={110}
        color="green"
      />
    );

    expect(screen.getByText("110%")).toBeInTheDocument();
  });
});
