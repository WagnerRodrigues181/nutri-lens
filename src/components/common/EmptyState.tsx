import { ComponentType } from "react";

interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-600">{description}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-green-500 px-6 py-2.5 font-medium text-white transition-all hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
