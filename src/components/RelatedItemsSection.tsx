import type { ReactNode } from "react";

import { EmptyState } from "./EmptyState";
import { DetailSection } from "./DetailSection";

type RelatedItemsSectionProps<T> = {
  title: string;
  items: T[];
  emptyMessage: string;
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
};

export function RelatedItemsSection<T>({
  title,
  items,
  emptyMessage,
  getKey,
  renderItem,
}: RelatedItemsSectionProps<T>) {
  return (
    <DetailSection title={title}>
      {items.length > 0 ? (
        <ul className="space-y-2 list-none">
          {items.map((item) => (
            <li key={getKey(item)}>{renderItem(item)}</li>
          ))}
        </ul>
      ) : (
        <EmptyState>{emptyMessage}</EmptyState>
      )}
    </DetailSection>
  );
}
