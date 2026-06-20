import Markdown from "react-markdown";

import { DetailSection } from "./DetailSection";

type MarkdownSectionProps = {
  title: string;
  content: string;
};

export function MarkdownSection({ title, content }: MarkdownSectionProps) {
  return (
    <DetailSection title={title}>
      <div className="text-zinc-300 text-sm md:text-base [&_p]:mb-3 md:[&_p]:mb-4">
        <Markdown>{content}</Markdown>
      </div>
    </DetailSection>
  );
}
