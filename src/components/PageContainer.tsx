import type { ReactNode } from "react";

import { PAGE_WIDTH } from "./layout";

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className={`${PAGE_WIDTH} py-4 sm:py-6`}>{children}</div>;
}
