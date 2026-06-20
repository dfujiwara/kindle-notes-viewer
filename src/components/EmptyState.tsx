import type { ReactNode } from "react";

type EmptyStateProps = {
  children: ReactNode;
  className?: string;
};

export function EmptyState({ children, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`rounded-lg border border-dashed border-zinc-700 bg-zinc-800/70 px-4 py-6 text-center ${className}`.trim()}
    >
      <p className="text-zinc-400 text-sm sm:text-base">{children}</p>
    </div>
  );
}
