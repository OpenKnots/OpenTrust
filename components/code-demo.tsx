'use client';

import {
  Code,
  CodeBlock,
  CodeHeader,
} from '@/components/animate-ui/components/animate/code';
import { FileCode } from 'lucide-react';

const DEMO_CODE = `import { memorySearch, memoryInspect } from "opentrust";

const results = await memorySearch({
  query: "deployment regression after queue changes",
  scope: {
    sources: ["sessions", "memoryEntries", "artifacts"],
    timeRange: { from: "2026-03-01" },
  },
  mode: "hybrid",
  limit: 10,
  minConfidence: 0.72,
});

const evidence = await memoryInspect({
  ref: results[0],
  includeLineage: true,
  includeRelated: true,
});`;

export function CodeDemo() {
  return (
    <Code
      key="code-demo"
      className="aui-code--landing"
      code={DEMO_CODE}
    >
      <CodeHeader icon={FileCode} copyButton>
        memory-query.ts
      </CodeHeader>

      <CodeBlock
        cursor
        lang="typescript"
        writing
        duration={8000}
        delay={500}
      />
    </Code>
  );
}
