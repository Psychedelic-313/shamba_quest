// @ts-nocheck
import { test, expect } from '@playwright/test'

test('quiz submission happy path (smoke)', async ({ request }) => {
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
