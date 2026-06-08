type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export const ErrorState = ({
  title = "Xatolik yuz berdi",
  message,
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
        {message && (
          <p className="text-sm text-zinc-500 max-w-xs">{message}</p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
        >
          Qayta urinish
        </button>
      )}
    </div>
  );
};
