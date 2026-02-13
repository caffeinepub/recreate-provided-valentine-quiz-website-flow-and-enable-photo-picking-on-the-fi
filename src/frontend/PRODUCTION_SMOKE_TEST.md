# Production Smoke Test Checklist

## Overview
This checklist validates the core Valentine's Day experience in production after deployment.

## Test Environment
- **URL**: [Production URL]
- **Date**: [Test Date]
- **Tester**: [Your Name]
- **Browser/Device**: [e.g., Chrome 120 / iPhone 14, Safari / Desktop]

---

## Test Cases

### 1. Welcome Screen → Quiz Transition
- [ ] Welcome screen displays "Welcome Wania Akhand"
- [ ] "The Ultimate Valentine Championship" title is visible
- [ ] "Start Baby" button is present and clickable
- [ ] Clicking "Start Baby" button transitions to Quiz screen
- [ ] Background music starts playing (if audio is enabled)
- [ ] No console errors during transition

**Status**: ☐ Pass ☐ Fail  
**Notes**: _______________________________________________

---

### 2. Quiz Flow & Answer Gating
- [ ] Quiz displays first question with multiple choice options
- [ ] Selecting incorrect answer shows feedback (button state/message)
- [ ] Quiz does NOT progress on incorrect answers
- [ ] Selecting correct answer allows progression to next question
- [ ] All 10 questions can be completed by selecting correct answers
- [ ] Quiz completion transitions to final memories page
- [ ] No console errors during quiz flow

**Status**: ☐ Pass ☐ Fail  
**Notes**: _______________________________________________

---

### 3. "Open Our Memories" Interaction (Desktop)
- [ ] Final page displays "My Love Letter 💕" heading
- [ ] Love letter text is visible and readable
- [ ] "Open Our Memories" button is present
- [ ] Clicking "Open Our Memories" reveals the memories gallery
- [ ] Button changes to "Hide Our Memories" after opening
- [ ] Clicking "Hide Our Memories" collapses the gallery
- [ ] No interaction blockers or pointer-events issues

**Status**: ☐ Pass ☐ Fail  
**Notes**: _______________________________________________

---

### 4. "Open Our Memories" Interaction (Mobile)
- [ ] "Open Our Memories" button is tappable on mobile
- [ ] Tap reliably opens the memories gallery
- [ ] No double-tap required
- [ ] Button responds to touch events correctly
- [ ] Gallery opens smoothly without lag

**Status**: ☐ Pass ☐ Fail  
**Notes**: _______________________________________________

---

### 5. Memories Gallery Display
- [ ] Gallery displays preloaded memory thumbnails
- [ ] All 12 preloaded images render correctly
- [ ] Thumbnails are properly sized and aligned
- [ ] No broken image icons or loading errors
- [ ] "Add Photos from Your Device" button is visible
- [ ] Gallery layout is responsive on mobile/tablet/desktop

**Status**: ☐ Pass ☐ Fail  
**Notes**: _______________________________________________

---

### 6. Lightbox Functionality (Desktop)
- [ ] Clicking a thumbnail opens the lightbox modal
- [ ] Selected image displays at full size in lightbox
- [ ] Lightbox has a close button (X)
- [ ] Clicking close button closes the lightbox
- [ ] Pressing ESC key closes the lightbox
- [ ] Clicking overlay/backdrop closes the lightbox
- [ ] Multiple images can be opened sequentially

**Status**: ☐ Pass ☐ Fail  
**Notes**: _______________________________________________

---

### 7. Lightbox Functionality (Mobile)
- [ ] Tapping a thumbnail opens the lightbox
- [ ] Image displays correctly on mobile screen
- [ ] Close button is tappable and accessible
- [ ] Tapping outside image closes lightbox
- [ ] No pinch-zoom conflicts
- [ ] Lightbox is responsive and doesn't break layout

**Status**: ☐ Pass ☐ Fail  
**Notes**: _______________________________________________

---

### 8. Love Letter Display
- [ ] Love letter text is visible in the card
- [ ] Text formatting is preserved (line breaks, spacing)
- [ ] Text is readable on all screen sizes
- [ ] No text overflow or clipping issues
- [ ] Fallback message displays if backend fails (with note)

**Status**: ☐ Pass ☐ Fail  
**Notes**: _______________________________________________

---

### 9. Visual & Animation Quality
- [ ] Floating petals animation is smooth
- [ ] Heart icons pulse correctly
- [ ] Fade-in animations work on all pages
- [ ] Pink/Valentine theme colors are consistent
- [ ] No visual glitches or layout shifts
- [ ] Responsive design works on mobile/tablet/desktop

**Status**: ☐ Pass ☐ Fail  
**Notes**: _______________________________________________

---

### 10. Production Artifacts Check
- [ ] No preview-only URL parameters in address bar
- [ ] No version/build query strings visible
- [ ] No development/debug labels in UI
- [ ] Console is free of preview-related warnings
- [ ] Application behaves as approved Version 24

**Status**: ☐ Pass ☐ Fail  
**Notes**: _______________________________________________

---

## Overall Test Result

**Total Pass**: _____ / 10  
**Total Fail**: _____ / 10

**Production Ready**: ☐ Yes ☐ No

---

## Critical Issues Found
(List any blocking issues that prevent production release)

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## Non-Critical Issues Found
(List any minor issues that can be addressed post-launch)

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## Sign-Off

**Tester Signature**: _______________________________________________  
**Date**: _______________________________________________  
**Approved for Production**: ☐ Yes ☐ No

---

## Notes

- Test on at least 2 different browsers (Chrome, Safari, Firefox)
- Test on at least 2 different devices (Desktop, Mobile)
- Document any browser-specific issues
- Take screenshots of any failures for debugging
