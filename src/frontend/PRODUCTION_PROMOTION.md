# Production Promotion Guide

## Overview
This document outlines the steps to promote an approved preview version to production deployment.

## Promotion Steps

### 1. Verify Preview Version
- Confirm the preview version number (e.g., Version 21) has been approved
- Test all critical user flows in the preview environment
- Document any last-minute issues or concerns

### 2. Code Preparation
- Ensure the production build is created from the exact same commit/tag as the approved preview
- Verify that `frontend/src/utils/releaseMode.ts` is present and properly integrated
- Confirm `App.tsx` calls `initReleaseMode()` on mount

### 3. Build Process
- Run production build from the approved Version 21 codebase
- Verify build artifacts match preview version exactly
- Test build locally before deployment

### 4. Deployment
- Deploy to production canister
- Verify deployment success
- Run smoke tests immediately after deployment

### 5. Post-Deployment Verification
- Complete full smoke test checklist (see PRODUCTION_SMOKE_TEST.md)
- Verify clean URL (no preview artifacts)
- Test on multiple browsers and devices
- Monitor for errors in production logs

## Preview Artifact Sanitization

Version 21 includes automatic sanitization of preview-only URL parameters:
- Query parameters: `?preview=`, `?version=`, `?v=`, `?build=`, `?test=`
- Hash fragments containing `preview` or `version`

The `releaseMode.ts` utility automatically removes these on app load, ensuring production visitors see the clean experience.

## Rollback Procedure

If critical issues are discovered post-deployment:

1. **Immediate**: Revert to previous stable production version
2. **Document**: Record all issues found
3. **Fix**: Address issues in development environment
4. **Re-test**: Complete full smoke test cycle
5. **Re-deploy**: Follow promotion steps again

## Version 21 Checklist

- [ ] Preview Version 21 fully tested and approved
- [ ] All smoke test items pass in preview
- [ ] Production build created from Version 21 codebase
- [ ] Deployment completed successfully
- [ ] Post-deployment smoke test completed
- [ ] No critical issues found
- [ ] Production sign-off obtained

## Notes

- Always test preview version thoroughly before promotion
- Keep detailed records of all deployment steps
- Have rollback plan ready before deployment
- Monitor production closely for first 24 hours after deployment
