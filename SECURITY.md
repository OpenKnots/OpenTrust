# Security Policy

## Deployment Model

OpenTrust is designed for local-first, localhost-only use.

- Data is stored in a local SQLite database under `storage/`
- The `/api/memory/*` routes are unauthenticated by design
- Do not expose this app directly to untrusted networks or the public internet

If you need remote access, add authentication, transport security, rate limiting, and network restrictions before deployment.

## Secrets And Private Data

- `.env`, `.env.local`, and local database files are ignored by git
- Pre-commit secret scanning runs with `pnpm run secrets:check`
- `.env.example` documents the optional `OPENTRUST_SQLITE_VEC_PATH` variable

Before sharing a dataset or demo, review any ingested OpenClaw session, workflow, and artifact data for private content that should remain local.

## Reporting A Vulnerability

Please report suspected vulnerabilities privately before public disclosure.

- Open a private GitHub security advisory if the repository supports it
- Otherwise contact the maintainers directly with reproduction steps, impact, and affected commits or versions
- Do not open a public issue for unpatched security problems
