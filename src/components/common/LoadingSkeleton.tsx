interface LoadingSkeletonProps {
  variant?: "card" | "text" | "circle" | "chart";
  count?: number;
}

export default function LoadingSkeleton({
  variant = "card",
  count = 1,
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count });

  if (variant === "card") {
    return (
      <>
        {skeletons.map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6"
          >
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-8 w-32 rounded bg-gray-200" />
              <div className="h-2 w-full rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === "text") {
    return (
      <>
        {skeletons.map((_, index) => (
          <div
            key={index}
            className="h-4 w-full animate-pulse rounded bg-gray-200"
          />
        ))}
      </>
    );
  }

  if (variant === "circle") {
    return (
      <>
        {skeletons.map((_, index) => (
          <div
            key={index}
            className="h-32 w-32 animate-pulse rounded-full bg-gray-200"
          />
        ))}
      </>
    );
  }

  if (variant === "chart") {
    return (
      <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6">
        <div className="space-y-4">
          <div className="h-6 w-48 rounded bg-gray-200" />
          <div className="h-64 w-full rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  return null;
}
