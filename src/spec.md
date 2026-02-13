# Specification

## Summary
**Goal:** Promote the already user-approved Version 25 preview build to the live/production site with no code or content changes, and verify it works via a production smoke test.

**Planned changes:**
- Promote/deploy the exact approved Version 25 build/commit to production (publish-only; no changes).
- Run the production smoke test checklist (frontend/PRODUCTION_SMOKE_TEST.md) after deployment and record pass/fail notes.

**User-visible outcome:** Visiting the production URL loads Version 25 as the active main version (without any preview/debug indicators), and the core Valentine flow works end-to-end in production.
