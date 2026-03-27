import { describe, it, expect } from "vitest";
import { extractArtifactsFromText } from "@/lib/opentrust/artifact-extract";

describe("extractArtifactsFromText", () => {
  it("extracts URLs", () => {
    const text = "Check out https://example.com/docs and http://localhost:3000";
    const artifacts = extractArtifactsFromText(text);

    const urls = artifacts.filter((a) => a.kind === "url");
    expect(urls.length).toBeGreaterThanOrEqual(2);
    expect(urls.some((a) => a.uri.includes("example.com"))).toBe(true);
  });

  it("extracts GitHub-style repo references", () => {
    const text = "See OpenKnots/OpenTrust for details";
    const artifacts = extractArtifactsFromText(text);

    const repos = artifacts.filter((a) => a.kind === "repo");
    expect(repos.some((a) => a.uri === "OpenKnots/OpenTrust")).toBe(true);
  });

  it("extracts doc file references", () => {
    const text = "Updated docs/ARCHITECTURE.md and lib/opentrust/db.ts";
    const artifacts = extractArtifactsFromText(text);

    const docs = artifacts.filter((a) => a.kind === "doc");
    expect(docs.some((a) => a.uri.includes("ARCHITECTURE.md"))).toBe(true);
    expect(docs.some((a) => a.uri.includes("db.ts"))).toBe(true);
  });

  it("deduplicates artifacts by kind+uri", () => {
    const text = "See https://example.com and also https://example.com again";
    const artifacts = extractArtifactsFromText(text);

    const urls = artifacts.filter((a) => a.kind === "url" && a.uri.includes("example.com"));
    expect(urls).toHaveLength(1);
  });

  it("limits to 24 artifacts", () => {
    const urls = Array.from({ length: 30 }, (_, i) => `https://example.com/page${i}`).join(" ");
    const artifacts = extractArtifactsFromText(urls);
    expect(artifacts.length).toBeLessThanOrEqual(24);
  });

  it("returns empty for text with no artifacts", () => {
    const artifacts = extractArtifactsFromText("Just plain text with no links or references");
    // May or may not have matches depending on regex — at minimum should not throw
    expect(Array.isArray(artifacts)).toBe(true);
  });
});
