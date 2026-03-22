# Security Policy

## Deployment Model

OpenTrust is designed for local-first use with a protected app boundary.

- Data is stored in a local SQLite database under `storage/`
- Protected app routes and memory APIs require app authentication when auth is enabled
- Authentication is enforced at the OpenTrust web/app layer, not at the SQLite file itself
- Do not expose this app directly to untrusted networks or the public internet without auth, transport security, and network restrictions

Recommended posture for remote or shared access:

- `OPENTRUST_AUTH_MODE=password`
- `OPENTRUST_ALLOW_LOCALHOST_BYPASS=false`
- HTTPS and private-network exposure only
- reverse-proxy or network ACL restrictions where possible
- review `storage/audit/auth.log` for login activity

## Secrets And Private Data

- `.env`, `.env.local`, and local database files are ignored by git
- Pre-commit secret scanning runs with `pnpm run secrets:check`
- `.env.example` documents auth and sqlite-vec environment variables
- Authentication events are logged to `storage/audit/auth.log`

Before sharing a dataset or demo, review any ingested OpenClaw session, workflow, and artifact data for private content that should remain local.

## Reporting A Vulnerability

Please report suspected vulnerabilities privately before public disclosure.

- Open a private GitHub security advisory if the repository supports it
- Otherwise contact the maintainers directly with reproduction steps, impact, and affected commits or versions
- Do not open a public issue for unpatched security problems
