// Mock the evaluator module so the POST handler receives a deterministic correct result
jest.mock('./submit/evaluator', () => ({
  evaluateAnswer: jest.fn(() => Promise.resolve({ isCorrect: true, feedback: 'Great job! Your answer demonstrates a good understanding.' })),
}))

import { POST } from './route'

// Mock Supabase client
const mockInsert = jest.fn().mockReturnThis()
const mockSelect = jest.fn().mockReturnThis()
const mockSingle = jest.fn().mockResolvedValue({
  data: { id: 'attempt789' },
  error: null,
})

const mockProfileSelect = jest.fn().mockReturnThis()
const mockProfileEq = jest.fn().mockReturnThis()
const mockProfileSingle = jest.fn().mockResolvedValue({
  data: { total_xp: 200, current_level: 2 },
})

const mockUpdate = jest.fn().mockReturnThis()

jest.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === 'quiz_attempts') {
        return {
          insert: mockInsert,
          select: mockSelect,
          single: mockSingle,
        }
      }
      if (table === 'profiles') {
        return {
          select: mockProfileSelect,
          eq: mockProfileEq,
          single: mockProfileSingle,
          update: mockUpdate,
        }
      }
      return {}
    },
  }),
}))

jest.mock('@/lib/gamification', () => ({
  calculateLevel: jest.fn(() => 3),
  awardEligibleBadges: jest.fn(() => Promise.resolve(['badge1', 'badge2'])),
}))

describe('POST /api/quiz', () => {
  it('should process quiz submission and return expected response', async () => {
    const mockRequest = {
      json: async () => ({
        questionId: 'q123',
        userAnswer: 'Photosynthesis is the process by which plants make food',
        correctAnswer: 'Photosynthesis is the process by which green plants convert sunlight into energy',
        userId: 'user456',
        xpReward: 100,
      }),
    }

    const response = await POST(mockRequest as any)
    const result = await response.json()

    expect(result).toEqual({
      attemptId: 'attempt789',
      isCorrect: true,
      xpEarned: 100,
      feedback: expect.stringContaining('Great job!'),
      newBadges: ['badge1', 'badge2'],
      leveledUp: true,
      newLevel: 3,
    })
  })
})
