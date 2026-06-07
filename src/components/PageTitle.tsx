import type { ReactNode } from "react";

type PageTitleProps = {
  children: ReactNode;
  className?: string;
};

export function PageTitle({ children, className = "" }: PageTitleProps) {
  return (
    <h1
      className={`text-2xl sm:text-3xl font-bold tracking-tight mb-4 sm:mb-6 ${className}`.trim()}
    >
      {children}
    </h1>
  );
}
