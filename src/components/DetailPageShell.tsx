import type { ReactNode } from "react";

import { PageContainer } from "./PageContainer";

type DetailPageShellProps = {
  children: ReactNode;
};

export function DetailPageShell({ children }: DetailPageShellProps) {
  return (
    <PageContainer>
      <div className="space-y-4 sm:space-y-6">{children}</div>
    </PageContainer>
  );
}
