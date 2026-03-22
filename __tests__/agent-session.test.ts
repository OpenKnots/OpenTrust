import { describe, it, expect } from 'vitest'
import {
  buildEditorContext,
  CODE_EDITOR_SESSION_KEY,
  CODE_EDITOR_SYSTEM_PROMPT,
} from '@/lib/agent-session'

describe('constants', () => {
  it('exports a session key', () => {
    expect(CODE_EDITOR_SESSION_KEY).toBe('agent:main:code-editor')
  })

  it('exports a system prompt', () => {
    expect(CODE_EDITOR_SYSTEM_PROMPT.length).toBeGreaterThan(100)
    expect(CODE_EDITOR_SYSTEM_PROMPT).toContain('KnotCode Agent')
  })
})

describe('buildEditorContext', () => {
  it('returns instructions block even with empty params', () => {
    const ctx = buildEditorContext({})
    expect(ctx).toContain('[Instructions:')
  })

  it('includes repo info when provided', () => {
    const ctx = buildEditorContext({ repoFullName: 'org/repo', branch: 'dev' })
    expect(ctx).toContain('[Repository: org/repo (dev)]')
  })

  it('defaults branch to main', () => {
    const ctx = buildEditorContext({ repoFullName: 'org/repo' })
    expect(ctx).toContain('(main)')
  })

  it('includes active file content', () => {
    const ctx = buildEditorContext({
      activeFilePath: 'src/index.ts',
      activeFileContent: 'const x = 1',
      activeFileLanguage: 'typescript',
    })
    expect(ctx).toContain('[Active file: src/index.ts]')
    expect(ctx).toContain('const x = 1')
  })

  it('truncates long file content at 8000 chars', () => {
    const longContent = 'x'.repeat(9000)
    const ctx = buildEditorContext({
      activeFilePath: 'big.ts',
      activeFileContent: longContent,
    })
    expect(ctx).toContain('[...truncated at 8000 chars]')
  })

  it('includes selection info', () => {
    const ctx = buildEditorContext({
      selection: { startLine: 5, endLine: 10, text: 'selected code' },
    })
    expect(ctx).toContain('[Selection: lines 5-10]')
    expect(ctx).toContain('selected code')
  })

  it('includes open files list', () => {
    const ctx = buildEditorContext({
      openFiles: [
        { path: 'a.ts', dirty: false },
        { path: 'b.ts', dirty: true },
      ],
    })
    expect(ctx).toContain('[Open files]')
    expect(ctx).toContain('a.ts')
    expect(ctx).toContain('b.ts (modified)')
  })

  it('includes runtime info for non-local', () => {
    const ctx = buildEditorContext({ runtime: 'cloud' })
    expect(ctx).toContain('[Runtime: cloud]')
  })

  it('omits runtime for local', () => {
    const ctx = buildEditorContext({ runtime: 'local' })
    expect(ctx).not.toContain('[Runtime:')
  })

  it('includes full permissions notice', () => {
    const ctx = buildEditorContext({ permissions: 'full' })
    expect(ctx).toContain('auto-applied without review')
  })
})
