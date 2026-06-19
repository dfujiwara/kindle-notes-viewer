import type { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
};

export function PageHeader({ title, subtitle, meta, action }: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 break-words">
          {title}
        </h1>
        {subtitle && <div className="mb-2">{subtitle}</div>}
        {meta && <div className="text-zinc-400 text-sm">{meta}</div>}
      </div>
      {action}
    </header>
  );
}
