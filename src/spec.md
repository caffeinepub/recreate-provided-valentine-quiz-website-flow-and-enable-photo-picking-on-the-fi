# Specification

## Summary
**Goal:** Restore and consistently display the exact user-provided love letter text by aligning backend defaults with the frontend `defaultLoveLetter`, adding a safe conditional upgrade migration, and ensuring the UI falls back to the frontend default only when needed.

**Planned changes:**
- Update `loveLetterTemplate` in `backend/main.mo` so `getLoveLetter()` returns text that matches `frontend/src/valentine/loveLetter.ts` `defaultLoveLetter` exactly (including all line breaks, punctuation, em dash (—), and the ❤️ emoji).
- Add conditional upgrade migration logic so existing deployments are corrected only when the stored love letter still equals the previously-shipped wrong default backend template, without overwriting customized letters set via `updateLoveLetter()`.
- Update the love letter UI to prefer the backend value when present, but fall back to the exact `defaultLoveLetter` when the backend value is missing/empty/whitespace-only or the query fails, preserving formatting with `whitespace-pre-wrap`.

**User-visible outcome:** The love letter shown in the app matches the intended text and formatting exactly; existing users see the corrected default letter after upgrade unless they previously customized it.
