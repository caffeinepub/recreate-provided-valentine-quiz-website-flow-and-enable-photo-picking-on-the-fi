# Specification

## Summary
**Goal:** Remove the prewritten default love letter and let users write and manage their own letter on the “My Love Letter” page.

**Planned changes:**
- Update the “My Love Letter” page to show an empty-state prompt (instead of `defaultLoveLetter`) when `getLoveLetter()` returns empty/whitespace, while preserving line breaks for non-empty letters.
- Adjust edit mode so it does not auto-insert any prewritten template text, and add a clear control to erase/clear the current textarea content during editing.
- Initialize backend love letter storage as empty on fresh install so `getLoveLetter()` starts blank until the user saves a letter.

**User-visible outcome:** When no letter has been written yet, the “My Love Letter” page appears blank with a prompt to write one; users can edit from a blank state, clear the letter while editing, and save/cancel as before.
