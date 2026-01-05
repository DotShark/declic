// ============================================
// TYPE UNIONS
// ============================================

/**
 * Types of addictive behaviors tracked by the platform
 */
export type Behavior = 
  | 'ALCOHOL'
  | 'TOBACCO'
  | 'CANNABIS'
  | 'MEDICATION'
  | 'PARTY_DRUGS'
  | 'SOCIAL_MEDIA'
  | 'VIDEO_GAMES'
  | 'GAMBLING'
  | 'PORNOGRAPHY'
  | 'SNACKING'
  | 'OVERWORK'

/**
 * Question types for UI rendering
 */
export type QuestionType = 
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'

/**
 * User's motivation for taking the survey (Q1)
 * Used to adapt the tone and urgency of recommendations
 */
export type UserMotivation = 
  | 'CURIOSITY'
  | 'QUESTIONING_HABITS'
  | 'CONCERNED_RELATIVE'
  | 'SEEKING_HELP'
  | 'OTHER'

// ============================================
// QUESTION STRUCTURE
// ============================================

/**
 * Single answer option for a question
 */
export interface AnswerOption {
  id: string
  text: string
  value: number // Score contribution for algorithm
}

/**
 * Base question structure
 */
interface BaseQuestion {
  id: string
  type: QuestionType
  text: string
  subtitle?: string
  options: AnswerOption[]
}

/**
 * Motivation question (Q1) - not tied to any behavior
 */
export interface MotivationQuestion extends BaseQuestion {
}

/**
 * Behavior-related question
 */
export interface BehaviorQuestion extends BaseQuestion {
  associatedBehavior: Behavior
}

/**
 * Union of all question types
 */
export type Question = MotivationQuestion | BehaviorQuestion

// ============================================
// MODULES & SURVEY STRUCTURE
// ============================================

/**
 * Module representing one behavior
 * All questions are shown if the user selects this theme
 */
export interface SurveyModule {
  id: string
  name: string
  behavior: Behavior
  questions: BehaviorQuestion[]
  order: number
}

/**
 * Complete survey structure
 */
export interface Survey {
  id: string
  title: string
  description: string
  motivationQuestion: MotivationQuestion
  modules: SurveyModule[]
  estimatedDurationMinutes: number
}
