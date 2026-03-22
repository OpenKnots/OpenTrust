"use client";

import { BlockRenderer, useMarkdown } from "@create-markdown/react";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const { blocks } = useMarkdown(content);

  return (
    <div className={`markdown-preview ${className ?? ""}`}>
      <BlockRenderer blocks={blocks} />
    </div>
  );
}
