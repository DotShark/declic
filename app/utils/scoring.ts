import type { ModuleAnswers, SurveyModule } from '../../shared/types/survey-types';

/**
 * System to calculate scores based on ModuleAnswers and SurveyModule definition.
 * Stateless utility to process survey data.
 */
export class ScoringSystem {
  /**
   * Calculates the total score for a given module's answers.
   * Uses the values defined in the SurveyModule's question options.
   * 
   * @param answers The user's answers for a specific module.
   * @param moduleDefinition The module definition containing questions and answer values.
   */
  calculateScore(answers: ModuleAnswers, moduleDefinition: SurveyModule): number {
    let totalScore = 0;
    
    const questionMap = new Map(
      moduleDefinition.questions.map(q => [q.id, q])
    );

    for (const [questionId, selectedAnswerIds] of Object.entries(answers.answers)) {
      const question = questionMap.get(questionId);
      
      if (question) {
        const optionMap = new Map(
          question.options.map(o => [o.id, o])
        );

        selectedAnswerIds.forEach((answerId) => {
          const option = optionMap.get(answerId);
          if (option && typeof option.value === 'number') {
            totalScore += option.value;
          }
        });
      }
    }

    return totalScore;
  }
}

export const scoringSystem = new ScoringSystem();
