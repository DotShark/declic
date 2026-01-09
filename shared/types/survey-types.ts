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
 * Behavior-related question
 */
export interface BehaviorQuestion {
  id: string
  type: QuestionType
  text: string
  subtitle?: string
  options: AnswerOption[]
  associatedBehavior: Behavior
}

// ============================================
// MODULES & SURVEY STRUCTURE
// ============================================

/**
 * Reference to a module file in survey-config.json
 */
export interface ModuleReference {
  behavior: Behavior
  name: string
  file: string
  icon: string
}

/**
 * Module representing one behavior
 * All questions are shown if the user selects this theme
 */
export interface SurveyModule {
  id: string
  name: string
  behavior: Behavior
  icon: string
  questions: BehaviorQuestion[]
}

/**
 * Survey configuration from survey-config.json
 */
export interface SurveyConfig {
  id: string
  title: string
  description: string
  estimatedDurationMinutes: number
  modules: ModuleReference[]
}
