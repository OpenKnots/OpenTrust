export const CODE_EDITOR_SESSION_KEY = 'agent:main:code-editor'

export const CODE_EDITOR_SYSTEM_PROMPT = `You are KnotCode Agent, the coding assistant embedded inside Knot Code.

Operate like a pragmatic senior engineer: inspect context first, make direct edits when requested, explain tradeoffs clearly, and keep momentum high. Prefer concise, action-oriented responses, but include enough detail for the user to trust the result. Respect repository context, branch information, active file content, selections, open files, runtime hints, and permission mode when they are provided.

When permissions are full, edits and commands may be auto-applied without review. When permissions are limited, suggest safer next steps and highlight anything that would need confirmation. Keep the user grounded in what changed, why it changed, and what to verify next.`

export type EditorSelection = {
  startLine: number
  endLine: number
  text?: string
}

export type OpenFile = {
  path: string
  dirty?: boolean
}

export type BuildEditorContextParams = {
  repoFullName?: string
  branch?: string
  activeFilePath?: string
  activeFileContent?: string
  activeFileLanguage?: string
  selection?: EditorSelection
  openFiles?: OpenFile[]
  runtime?: string
  permissions?: 'read' | 'write' | 'full' | string
}

const ACTIVE_FILE_CHAR_LIMIT = 8000

function formatActiveFile(
  path: string,
  content: string,
  language?: string,
): string {
  const truncated = content.length > ACTIVE_FILE_CHAR_LIMIT
  const body = truncated
    ? `${content.slice(0, ACTIVE_FILE_CHAR_LIMIT)}\n[...truncated at 8000 chars]`
    : content

  const header = `[Active file: ${path}]`
  const languageLine = language ? `[Language: ${language}]\n\n` : ''

  return `${header}\n\n${languageLine}${body}`
}

function formatSelection(selection: EditorSelection): string {
  const lines = `[Selection: lines ${selection.startLine}-${selection.endLine}]`
  return selection.text ? `${lines}\n${selection.text}` : lines
}

function formatOpenFiles(openFiles: OpenFile[]): string {
  const lines = openFiles.map((file) =>
    file.dirty ? `- ${file.path} (modified)` : `- ${file.path}`,
  )

  return `[Open files]\n${lines.join('\n')}`
}

export function buildEditorContext(params: BuildEditorContextParams): string {
  const blocks: string[] = []

  blocks.push(
    '[Instructions: You are working inside Knot Code. Use the provided editor context to ground your answer, prefer concrete code changes, and summarize the exact files and verification steps involved.]',
  )

  if (params.repoFullName) {
    blocks.push(`[Repository: ${params.repoFullName} (${params.branch ?? 'main'})]`)
  }

  if (params.activeFilePath && typeof params.activeFileContent === 'string') {
    blocks.push(
      formatActiveFile(
        params.activeFilePath,
        params.activeFileContent,
        params.activeFileLanguage,
      ),
    )
  }

  if (params.selection) {
    blocks.push(formatSelection(params.selection))
  }

  if (params.openFiles?.length) {
    blocks.push(formatOpenFiles(params.openFiles))
  }

  if (params.runtime && params.runtime !== 'local') {
    blocks.push(`[Runtime: ${params.runtime}]`)
  }

  if (params.permissions === 'full') {
    blocks.push(
      '[Permissions: full — edits and commands may be auto-applied without review.]',
    )
  }

  return `${blocks.join('\n\n')}\n`
}
