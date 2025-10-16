# Test Plan - Shamba Quest (Hackathon)

This document contains the minimal test plan to validate the demo flows.

Smoke tests (manual / automated):
- Sign up / login
- Onboarding flow
- Submit a quiz (happy path): validate attemptId, isCorrect, xpEarned, newBadges, leveledUp, newLevel
- Dashboard and leaderboard load
- Profile edit

API tests:
- Quiz submission: missing fields -> 400
- Quiz submission: incorrect answer -> partial xp
- Supabase failures -> 500 and error logged

E2E (automated):
- Implement Playwright tests for the smoke flows.

Acceptance criteria:
- All critical smoke tests pass in CI before demo
- Unit tests cover core logic and pass on PRs
