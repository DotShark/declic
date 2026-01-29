import { describe, it, expect } from 'vitest'
import { calculateScore, calculateGlobalScore } from '../../app/utils/scoring'
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

      const score = calculateScore(answers, mockModule)
      expect(score).toBe(30)
    })

    it('calculates score correctly for multiple choice answers', () => {
      const answers: ModuleAnswers = {
        behavior: 'ALCOHOL',
        answers: {
          q1: ['a1', 'a2'],
        },
      }

      const score = calculateScore(answers, mockModule)
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

      const score = calculateScore(answers, mockModule)
      expect(score).toBe(0)
    })

    it('handles empty answers', () => {
      const answers: ModuleAnswers = {
        behavior: 'ALCOHOL',
        answers: {},
      }

      const score = calculateScore(answers, mockModule)
      expect(score).toBe(0)
    })
  })

  const mockModule2: SurveyModule = {
    id: 'module-tobacco',
    name: 'Tabac',
    behavior: 'TOBACCO',
    icon: 'lucide:cigarette',
    questions: [
      {
        id: 'q3',
        type: 'SINGLE_CHOICE',
        text: 'Question 3',
        associatedBehavior: 'TOBACCO',
        options: [{ id: 'c1', text: 'C1', value: 5 }],
      },
    ],
  }

  describe('calculateGlobalScore', () => {
    it('sums up scores from multiple modules', () => {
      const allAnswers = {
        ALCOHOL: {
          behavior: 'ALCOHOL',
          answers: {
            q1: ['a1'],
          },
        } as ModuleAnswers,
        TOBACCO: {
          behavior: 'TOBACCO',
          answers: {
            q3: ['c1'],
          },
        } as ModuleAnswers,
      }

      const modules = [
        {
          id: 'module-alcohol',
          name: 'Alcool',
          behavior: 'ALCOHOL',
          icon: 'lucide:wine',
          questions: [
            {
              id: 'q1',
              type: 'SINGLE_CHOICE',
              text: 'Question 1',
              associatedBehavior: 'ALCOHOL',
              options: [
                { id: 'a1', text: 'Answer 1', value: 10 },
                { id: 'a2', text: 'Answer 2', value: 5 },
              ],
            },
          ],
        },
        mockModule2,
      ] as SurveyModule[]

      const globalScore = calculateGlobalScore(allAnswers, modules)
      expect(globalScore).toBe(15)
    })
  })
})
