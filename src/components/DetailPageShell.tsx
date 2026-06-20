import type { ReactNode } from "react";
import { Link } from "react-router";

import { PageContainer } from "./PageContainer";

type DetailPageShellProps = {
  children: ReactNode;
  backLink?: {
    to: string;
    label: string;
  };
};

export function DetailPageShell({ children, backLink }: DetailPageShellProps) {
  return (
    <PageContainer>
      <div className="space-y-4 sm:space-y-6">
        {backLink && (
          <Link
            to={backLink.to}
            className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>{backLink.label}</span>
          </Link>
        )}
        {children}
      </div>
    </PageContainer>
  );
}
