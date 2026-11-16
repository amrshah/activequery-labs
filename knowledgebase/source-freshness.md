# Upstream Freshness and Version Status

Snapshot checked: 2026-11-16 (GitHub API recheck of all three upstream `main` refs).

## Published versions

Both upstream README files identify version **25.6.0** and say they were actively updated June 28, 2025. The source headers also identify v25.6.0.

## Recent repository history observed

| Repository | Latest commit observed on main | Date | Latest commit message | Last commit changing primary source file |
|---|---|---|---|---|
| ActiveQuery/CSS | `6f479f6a3f315d2623af79dd49c84cb379b52473` | 2025-07-05 | Update README.md | `b1120e47027ceba6e6c8b8bf7796af4f6f002f1d` — Update ActiveQuery.css, 2025-06-28 |
| ActiveQuery/JS | `adb1b19770ca68840dc2f9e62de556a324bee2fa` | 2025-07-05 | Add files via upload (ActiveQuery.min.js) | `5dd9145d6f36ad7e3966b6f55ecd6fcbe15003c7` — Add files via upload (ActiveQuery.js), 2025-07-05 |
| ActiveQuery/Governance | `ab369232ac801cfbf769d9838c07d4ea8846dfd5` | 2025-06-28 | Update CONVENTIONS.md | Not applicable |

The latest source revisions inspected in this knowledgebase are:
- AQCSS blob SHA: `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`
- AQJS blob SHA: `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`

## Interpretation

The public repositories' latest observed commits are from mid-2025, despite the current research date being November 2026. The source README version claims and source hashes match the inspected files, but the repository history does not show a 2026 source refresh in the commits examined.

This is not proof that the framework is abandoned or that no private development exists. It does mean:
- Do not assume current browser compatibility from old README badges.
- Treat v25.6.0 as the latest published version observed, not as evidence of recent maintenance.
- Validate modern CSS features and browser behavior independently.
- Recheck upstream history before any future portal release or production adoption.
- If a new source commit appears, compare the actual file blob hashes before updating the knowledgebase.

## Revalidation cadence

Before any new major implementation phase, recheck the upstream default branches and file blob SHAs. Do not rely on a calendar-only refresh if the source changes sooner.
