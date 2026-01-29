import { describe, it, expect } from 'vitest'
import {
  calculateModuleScore,
  calculateMaxScore,
  calculateDetailedScore,
} from '../../app/utils/scoring'
import type {
  ModuleAnswers,
  SurveyModule,
  BehaviorQuestion,
} from '../../shared/types/survey-types'

describe('Scoring Functions', () => {
  const mockQuestions: BehaviorQuestion[] = [
    {
      id: 'q1',
      type: 'SINGLE_CHOICE',
      text: 'Question 1',
      associatedBehavior: 'ALCOHOL',
      options: [
        { id: 'a1', text: 'Answer 1', value: 10 },
        { id: 'a2', text: 'Answer 2', value: 5 },
        { id: 'a3', text: 'Answer 3', value: 0 },
      ],
    },
    {
      id: 'q2',
      type: 'MULTIPLE_CHOICE',
      text: 'Question 2',
      associatedBehavior: 'ALCOHOL',
      options: [
        { id: 'b1', text: 'Answer B1', value: 20 },
        { id: 'b2', text: 'Answer B2', value: -5 },
      ],
    },
  ]

  const mockModule: SurveyModule = {
    id: 'module-alcohol',
    name: 'Alcool',
    behavior: 'ALCOHOL',
    icon: 'lucide:wine',
    questions: mockQuestions,
  }

  describe('calculateModuleScore', () => {
    it('calculates score correctly for single choice answers', () => {
      const answers: ModuleAnswers = {
        behavior: 'ALCOHOL',
        answers: {
          q1: ['a1'],
          q2: ['b1'],
        },
      }

      const score = calculateModuleScore(answers, mockModule)
      expect(score).toBe(30)
    })

    it('calculates score correctly for multiple choice answers', () => {
      const answers: ModuleAnswers = {
        behavior: 'ALCOHOL',
        answers: {
          q1: ['a1', 'a2'],
        },
      }

      const score = calculateModuleScore(answers, mockModule)
      expect(score).toBe(15)
    })

    it('ignores answers that are not found in the module definition', () => {
      const answers: ModuleAnswers = {
        behavior: 'ALCOHOL',
        answers: {
          q1: ['unknown_answer'],
          unknown_question: ['a1'],
        },
      }

      const score = calculateModuleScore(answers, mockModule)
      expect(score).toBe(0)
    })

    it('handles empty answers', () => {
      const answers: ModuleAnswers = {
        behavior: 'ALCOHOL',
        answers: {},
      }

      const score = calculateModuleScore(answers, mockModule)
      expect(score).toBe(0)
    })
  })

  describe('calculateMaxScore', () => {
    it('calculates maximum possible score for a module', () => {
      const maxScore = calculateMaxScore(mockModule)
      // q1 max = 10, q2 max = 20, total = 30
      expect(maxScore).toBe(30)
    })

    it('handles modules with negative values correctly', () => {
      const moduleWithNegative: SurveyModule = {
        ...mockModule,
        questions: [
          {
            id: 'q3',
            type: 'SINGLE_CHOICE',
            text: 'Question 3',
            associatedBehavior: 'ALCOHOL',
            options: [
              { id: 'c1', text: 'Answer C1', value: -10 },
              { id: 'c2', text: 'Answer C2', value: 5 },
            ],
          },
        ],
      }

      const maxScore = calculateMaxScore(moduleWithNegative)
      expect(maxScore).toBe(5)
    })
  })

  describe('calculateDetailedScore', () => {
    it('calculates detailed score with percentage', () => {
      const answers: ModuleAnswers = {
        behavior: 'ALCOHOL',
        answers: {
          q1: ['a2'], // 5 points
          q2: ['b1'], // 20 points
        },
      }

      const detailedScore = calculateDetailedScore(answers, mockModule)

      expect(detailedScore).toEqual({
        behavior: 'ALCOHOL',
        score: 25,
        maxPossibleScore: 30,
        percentageScore: 83, // 25/30 * 100 = 83.33 rounded to 83
      })
    })

    it('handles zero score correctly', () => {
      const answers: ModuleAnswers = {
        behavior: 'ALCOHOL',
        answers: {},
      }

      const detailedScore = calculateDetailedScore(answers, mockModule)

      expect(detailedScore.score).toBe(0)
      expect(detailedScore.percentageScore).toBe(0)
    })
  })
})
