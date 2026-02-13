# Specification

## Summary
**Goal:** Promote the user-approved Version 24 preview deployment to live/production and verify the core Valentine flow works end-to-end in production.

**Planned changes:**
- Deploy the live/production site from the exact same code/content as the approved Version 24 preview.
- Ensure production does not expose any preview/development artifacts (e.g., preview-only URLs/labels).
- Run a production smoke test covering: Welcome screen → Start → quiz progression (correct answers required) → final “Our Memories” reveal → memories gallery (thumbnails + lightbox) → love letter text visibility.

**User-visible outcome:** Visiting the app’s production URL shows the Version 24 experience, and users can complete the full Valentine flow through the final memories and love letter view.
