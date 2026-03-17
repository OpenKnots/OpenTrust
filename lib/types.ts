export type CapabilityKind = "skill" | "plugin" | "soul" | "bundle";

export interface ManualSection {
  id: string;
  title: string;
  summary: string;
}

export interface TraceCardData {
  title: string;
  badge: string;
  summary: string;
  bullets: string[];
}

export interface CapabilityCardData {
  name: string;
  kind: CapabilityKind;
  summary: string;
  evidence: string;
}

export interface QueryExample {
  title: string;
  sql: string;
}
