type ContentItem = Record<string, unknown>;

type ToolCallDraft = {
  id: string;
  toolName: string;
  argumentsJson: string;
  startedAt: string;
  status: string;
};

export type ToolResultUpdate = {
  id: string;
  resultJson: string;
  status: string;
  finishedAt: string;
  errorText: string | null;
};

function stringify(value: unknown) {
  return JSON.stringify(value ?? {});
}

export function makeToolCallDraft(item: ContentItem, fallbackId: string, startedAt: string): ToolCallDraft {
  return {
    id: typeof item.id === "string" ? item.id : fallbackId,
    toolName: typeof item.name === "string" ? item.name : "unknown",
    argumentsJson: stringify(item.arguments ?? {}),
    startedAt,
    status: "running",
  };
}

export function maybeBuildToolResultUpdate(items: ContentItem[], finishedAt: string): ToolResultUpdate | null {
  const toolUseId = items.find((item) => typeof item.toolUseId === "string")?.toolUseId;
  if (typeof toolUseId !== "string") return null;

  const payload = items.map((item) => {
    const clone = { ...item };
    delete clone.toolUseId;
    return clone;
  });

  const textParts = payload
    .flatMap((item) => {
      const parts: string[] = [];
      if (typeof item.text === "string") parts.push(item.text);
      if (typeof item.stderr === "string") parts.push(item.stderr);
      if (typeof item.stdout === "string") parts.push(item.stdout);
      if (typeof item.error === "string") parts.push(item.error);
      return parts;
    })
    .filter(Boolean);

  const joined = textParts.join("\n\n").trim();
  const lowered = joined.toLowerCase();
  const errored = payload.some((item) => typeof item.isError === "boolean" && item.isError) || lowered.includes("error") || lowered.includes("failed");

  return {
    id: toolUseId,
    resultJson: stringify(payload),
    status: errored ? "error" : "success",
    finishedAt,
    errorText: errored ? (joined || "Tool returned an error.") : null,
  };
}
