import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AchievementBadge from "@/components/insights/AchievementBadge";
import type { Achievement } from "@/types";

describe("AchievementBadge", () => {
  it("should render unlocked achievement", () => {
    const achievement: Achievement = {
      id: "streak-7",
      title: "Sequência de 7 Dias",
      description: "Mantenha 7 dias consecutivos",
      icon: "🔥",
      isUnlocked: true,
      unlockedAt: new Date().toISOString(),
      progress: 100,
    };

    render(<AchievementBadge achievement={achievement} />);

    expect(screen.getByText("Sequência de 7 Dias")).toBeInTheDocument();
    expect(
      screen.getByText("Mantenha 7 dias consecutivos")
    ).toBeInTheDocument();
    expect(screen.getByText("🔥")).toBeInTheDocument();
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("should render locked achievement", () => {
    const achievement: Achievement = {
      id: "streak-30",
      title: "Mestre da Consistência",
      description: "30 dias consecutivos",
      icon: "🏆",
      isUnlocked: false,
      progress: 0,
    };

    const { container } = render(
      <AchievementBadge achievement={achievement} />
    );

    expect(screen.getByText("Mestre da Consistência")).toBeInTheDocument();
    expect(container.querySelector(".opacity-60")).toBeInTheDocument();
  });

  it("should show lock icon for locked achievements", () => {
    const achievement: Achievement = {
      id: "test",
      title: "Test Achievement",
      description: "Test Description",
      icon: "🎯",
      isUnlocked: false,
      progress: 0,
    };

    const { container } = render(
      <AchievementBadge achievement={achievement} />
    );

    const lockIcon = container.querySelector("svg");
    expect(lockIcon).toBeInTheDocument();
  });

  it("should apply special styling to unlocked achievements", () => {
    const achievement: Achievement = {
      id: "test",
      title: "Test",
      description: "Test",
      icon: "🎯",
      isUnlocked: true,
      progress: 100,
    };

    const { container } = render(
      <AchievementBadge achievement={achievement} />
    );

    expect(container.querySelector(".border-yellow-300")).toBeInTheDocument();
    expect(container.querySelector(".from-yellow-50")).toBeInTheDocument();
  });
});
