import type {
  Behavior,
  ModuleAnswers,
  SurveyModule,
} from '../../shared/types/survey-types'

/**
 * Result of scoring calculation for a single module
 */
export interface ModuleScore {
  behavior: Behavior
  score: number
  maxPossibleScore: number
  percentageScore: number
}

/**
 * Calculates the total score for a given module's answers.
 * Uses the values defined in the SurveyModule's question options.
 *
 * @param answers The user's answers for a specific module
 * @param module The module definition containing questions and answer values
 * @returns The total score based on selected answer values
 */
export function calculateModuleScore(
  answers: ModuleAnswers,
  module: SurveyModule,
): number {
  let totalScore = 0

  // Create lookup maps for efficient access
  const questionMap = new Map(module.questions.map((q) => [q.id, q]))

  // Sum up scores from all selected answers
  for (const [questionId, selectedAnswerIds] of Object.entries(
    answers.answers,
  )) {
    const question = questionMap.get(questionId)
    if (!question) continue

    const optionMap = new Map(question.options.map((o) => [o.id, o]))

    for (const answerId of selectedAnswerIds) {
      const option = optionMap.get(answerId)
      if (option && typeof option.value === 'number') {
        totalScore += option.value
      }
    }
  }

  return totalScore
}

/**
 * Calculates the maximum possible score for a module.
 * This is the sum of the highest value option for each question.
 *
 * @param module The module definition
 * @returns The maximum achievable score
 */
export function calculateMaxScore(module: SurveyModule): number {
  return module.questions.reduce((total, question) => {
    const maxOptionValue = Math.max(...question.options.map((o) => o.value), 0)
    return total + maxOptionValue
  }, 0)
}

/**
 * Calculates detailed scoring information for a module.
 *
 * @param answers The user's answers for a specific module
 * @param module The module definition
 * @returns Detailed scoring information including percentage
 */
export function calculateDetailedScore(
  answers: ModuleAnswers,
  module: SurveyModule,
): ModuleScore {
  const score = calculateModuleScore(answers, module)
  const maxPossibleScore = calculateMaxScore(module)
  const percentageScore =
    maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 0

  return {
    behavior: module.behavior,
    score,
    maxPossibleScore,
    percentageScore: Math.round(percentageScore),
  }
}
