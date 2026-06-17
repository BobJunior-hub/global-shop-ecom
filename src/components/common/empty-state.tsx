type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100">
        <svg
          className="w-8 h-8 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
        {description && (
          <p className="text-sm text-zinc-500 max-w-xs">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
};
