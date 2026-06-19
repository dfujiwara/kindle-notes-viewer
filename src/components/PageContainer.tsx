import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-4xl mx-auto">
      {children}
    </div>
  );
}
