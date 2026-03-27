import { createHash } from "node:crypto";
import { escapeSqlString, runSql, withTransaction } from "@/lib/opentrust/db";

export interface ExtractedArtifact {
  kind: "url" | "doc" | "repo" | "note";
  uri: string;
  title: string;
}

function artifactId(kind: string, uri: string) {
  return `artifact:${kind}:${createHash("sha1").update(uri).digest("hex").slice(0, 16)}`;
}

function normalize(value: string) {
  return value.trim();
}

/** Extract URLs, repo references, and doc paths from free-form text. */
export function extractArtifactsFromText(text: string): ExtractedArtifact[] {
  const artifacts = new Map<string, ExtractedArtifact>();

  const urlMatches = text.matchAll(/https?:\/\/[^\s)\]>'"]+/g);
  for (const match of urlMatches) {
    const uri = normalize(match[0]);
    artifacts.set(`url:${uri}`, { kind: "url", uri, title: uri });
  }

  const repoMatches = text.matchAll(/\b[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\b/g);
  for (const match of repoMatches) {
    const repo = normalize(match[0]);
    if (!repo.includes("/")) continue;
    artifacts.set(`repo:${repo}`, { kind: "repo", uri: repo, title: repo });
  }

  const docMatches = text.matchAll(/\b(?:docs\/[^\s:'"`]+|[A-Za-z0-9_.\/-]+\.(?:md|ts|tsx|js|jsx|json|sql))\b/g);
  for (const match of docMatches) {
    const uri = normalize(match[0]);
    artifacts.set(`doc:${uri}`, { kind: "doc", uri, title: uri });
  }

  return [...artifacts.values()].slice(0, 24);
}

/** Extract artifacts from text and link them to a trace via trace_edges. */
export function upsertArtifactsForTrace(traceId: string, text: string, createdAt: string) {
  const artifacts = extractArtifactsFromText(text);
  return withTransaction(() => {
  runSql(`DELETE FROM trace_edges WHERE from_kind = 'trace' AND from_id = ${escapeSqlString(traceId)} AND edge_type = 'references' AND to_kind = 'artifact';`);

  for (const artifact of artifacts) {
    const id = artifactId(artifact.kind, artifact.uri);
    runSql(`
      INSERT INTO artifacts (id, kind, uri, title, created_at, metadata_json)
      VALUES (
        ${escapeSqlString(id)},
        ${escapeSqlString(artifact.kind)},
        ${escapeSqlString(artifact.uri)},
        ${escapeSqlString(artifact.title)},
        ${escapeSqlString(createdAt)},
        ${escapeSqlString(JSON.stringify({ source: 'artifact-extractor', traceId }))}
      )
      ON CONFLICT(id) DO UPDATE SET
        title=excluded.title,
        metadata_json=excluded.metadata_json;

      INSERT OR REPLACE INTO trace_edges (id, from_kind, from_id, edge_type, to_kind, to_id, created_at, metadata_json)
      VALUES (
        ${escapeSqlString(`edge:${traceId}:artifact:${id}`)},
        'trace',
        ${escapeSqlString(traceId)},
        'references',
        'artifact',
        ${escapeSqlString(id)},
        ${escapeSqlString(createdAt)},
        ${escapeSqlString(JSON.stringify({ source: 'artifact-extractor' }))}
      );
    `);
  }

  return artifacts.length;
  });
}

/** Extract artifacts from text and link them to a workflow via run_artifacts. */
export function upsertArtifactsForWorkflow(workflowId: string, text: string, createdAt: string) {
  const artifacts = extractArtifactsFromText(text);
  return withTransaction(() => {
  runSql(`DELETE FROM run_artifacts WHERE run_id = ${escapeSqlString(workflowId)} AND relation = 'references';`);

  for (const artifact of artifacts) {
    const id = artifactId(artifact.kind, artifact.uri);
    runSql(`
      INSERT INTO artifacts (id, kind, uri, title, created_at, metadata_json)
      VALUES (
        ${escapeSqlString(id)},
        ${escapeSqlString(artifact.kind)},
        ${escapeSqlString(artifact.uri)},
        ${escapeSqlString(artifact.title)},
        ${escapeSqlString(createdAt)},
        ${escapeSqlString(JSON.stringify({ source: 'artifact-extractor', workflowId }))}
      )
      ON CONFLICT(id) DO UPDATE SET
        title=excluded.title,
        metadata_json=excluded.metadata_json;

      INSERT OR REPLACE INTO run_artifacts (run_id, artifact_id, relation)
      VALUES (
        ${escapeSqlString(workflowId)},
        ${escapeSqlString(id)},
        'references'
      );
    `);
  }

  return artifacts.length;
  });
}
