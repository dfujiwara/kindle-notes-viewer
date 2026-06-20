import { useId, type ReactNode } from "react";

type DetailSectionProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DetailSection({
  title,
  children,
  className = "",
}: DetailSectionProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={`space-y-2 ${className}`.trim()}
    >
      <h3 id={headingId} className="text-base md:text-lg font-semibold text-white">
        {title}
      </h3>
      {children}
    </section>
  );
}
