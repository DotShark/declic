import type {
  Behavior,
  ModuleAnswers,
  SurveyModule,
} from '../../shared/types/survey-types'

/**
 * Calculates the total score for a given module's answers.
 * Uses the values defined in the SurveyModule's question options.
 *
 * @param answers The user's answers for a specific module.
 * @param moduleDefinition The module definition containing questions and answer values.
 */
export function calculateScore(
  answers: ModuleAnswers,
  moduleDefinition: SurveyModule,
): number {
  let totalScore = 0

  const questionMap = new Map(moduleDefinition.questions.map((q) => [q.id, q]))

  for (const [questionId, selectedAnswerIds] of Object.entries(
    answers.answers,
  )) {
    const question = questionMap.get(questionId)

    if (question) {
      const optionMap = new Map(question.options.map((o) => [o.id, o]))

      selectedAnswerIds.forEach((answerId) => {
        const option = optionMap.get(answerId)
        if (option && typeof option.value === 'number') {
          totalScore += option.value
        }
      })
    }
  }

  return totalScore
}

/**
 * Calculates the total score across all modules.
 * @param allAnswers Record of answers by behavior.
 * @param modules List of loaded modules to look up values.
 */
export function calculateGlobalScore(
  allAnswers: Partial<Record<Behavior, ModuleAnswers>>,
  modules: SurveyModule[],
): number {
  let globalScore = 0
  const moduleMap = new Map(modules.map((m) => [m.behavior, m]))

  for (const [behavior, answers] of Object.entries(allAnswers)) {
    const moduleDef = moduleMap.get(behavior as Behavior)
    if (moduleDef && answers) {
      globalScore += calculateScore(answers, moduleDef)
    }
  }

  return globalScore
}
