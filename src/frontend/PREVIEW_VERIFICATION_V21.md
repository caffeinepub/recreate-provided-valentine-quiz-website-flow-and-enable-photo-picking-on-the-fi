# Version 21 Preview Verification Checklist

## Overview
Quick verification checklist for Version 21 preview before production promotion.

## Preview Environment
- **Preview URL**: [Insert Preview URL]
- **Version**: 21
- **Date**: [Test Date]
- **Tester**: [Your Name]

---

## Core Flow Verification

### 1. Clean URL Load
- [ ] Preview opens from clean URL (no special query params required)
- [ ] App renders correctly on initial load
- [ ] No blank screens or loading errors

**Status**: ☐ Pass ☐ Fail

---

### 2. Welcome → Quiz → Memories Flow
- [ ] Welcome screen displays correctly
- [ ] "Start Baby" button triggers quiz and music
- [ ] Quiz questions display properly
- [ ] Incorrect answers are gated (no progression)
- [ ] Correct answers allow progression
- [ ] Quiz completion transitions to final memories page

**Status**: ☐ Pass ☐ Fail

---

### 3. Final Memories Page
- [ ] Love letter displays with correct Version 21 content
- [ ] "Open Our Memories" button works on desktop
- [ ] "Open Our Memories" button works on mobile
- [ ] Gallery reveals 12 preloaded images
- [ ] Images render without errors
- [ ] Lightbox opens when clicking thumbnails

**Status**: ☐ Pass ☐ Fail

---

### 4. Version 21 Content Verification
- [ ] Love letter matches Version 21 text exactly
- [ ] All line breaks and formatting preserved
- [ ] Preloaded memories show Version 21 images only
- [ ] No post-V21 features or content visible

**Status**: ☐ Pass ☐ Fail

---

## Decision

**Preview Approved for Production**: ☐ Yes ☐ No

**Notes**: _______________________________________________

---

## Next Steps

If approved:
1. Proceed with production promotion (see PRODUCTION_PROMOTION.md)
2. Complete full smoke test after deployment
3. Monitor production for 24 hours

If not approved:
1. Document issues found
2. Create fix plan
3. Re-test after fixes
4. Re-run this checklist
