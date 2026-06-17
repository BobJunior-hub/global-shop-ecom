type LoaderProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
};

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-4",
};

export const Loader = ({ size = "md", label }: LoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <span
        className={`rounded-full border-zinc-300 border-t-zinc-900 animate-spin ${sizeClasses[size]}`}
        role="status"
        aria-label={label ?? "Loading"}
      />
      {label && <p className="text-sm text-zinc-500">{label}</p>}
    </div>
  );
};
