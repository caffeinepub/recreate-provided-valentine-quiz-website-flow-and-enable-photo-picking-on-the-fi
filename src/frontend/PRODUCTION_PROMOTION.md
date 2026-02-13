# Production Promotion Guide

## Overview
This document outlines the steps to promote an approved preview version to production deployment.

## Promotion Steps

### 1. Verify Preview Version
- Confirm the preview version number (e.g., Version 24) has been approved
- Test all critical user flows in the preview environment
- Document any last-minute issues or concerns

### 2. Code Preparation
- Ensure the production build is created from the exact same commit/tag as the approved preview
- Verify that `frontend/src/utils/releaseMode.ts` is present and properly integrated
- Confirm `App.tsx` calls `initReleaseMode()` on mount

### 3. Build Process
