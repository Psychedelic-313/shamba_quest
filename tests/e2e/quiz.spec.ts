// @ts-nocheck
import { test, expect } from '@playwright/test'

test('quiz submission happy path (smoke)', async ({ request }) => {
  // If the dev server isn't running locally, skip the E2E smoke test.
  // This keeps local npm test / CI from failing when E2E isn't set up.
  const ping = await request.get('http://localhost:3000/').catch(() => null)
  if (!ping || !ping.ok()) {
    test.skip(true, 'Local server not running on http://localhost:3000')
  }

  // This is a lightweight HTTP-level smoke test assuming an API route is accessible
  const res = await request.post('http://localhost:3000/api/quiz/submit', {
    data: {
      questionId: 'q123',
      userAnswer: 'Photosynthesis is the process by which plants make food',
      correctAnswer: 'Photosynthesis is the process by which green plants convert sunlight into energy',
      userId: 'user456',
      xpReward: 100,
    },
  })

  expect(res.ok()).toBeTruthy()
  const body = await res.json()
  expect(body).toHaveProperty('attemptId')
  expect(body).toHaveProperty('isCorrect')
})
