interface SurveyState {
  config: SurveyConfig | null
  error: string | null
  selectedBehaviors: Set<Behavior>
  modules: SurveyModule[]
  currentBehavior: Behavior | null
  currentQuestionIndex: number
  modulesAnswers: Partial<Record<Behavior, ModuleAnswers>>
}

export const useSurveyStore = defineStore('survey', {
  state: (): SurveyState => ({
    config: null,
    error: null,
    selectedBehaviors: new Set(),
    modules: [],
    currentBehavior: null,
    currentQuestionIndex: 0,
    modulesAnswers: {},
  }),

  getters: {
    hasSelection(): boolean {
      return this.selectedBehaviors.size > 0
    },

    isSelected: (state) => (behavior: Behavior) => {
      return state.selectedBehaviors.has(behavior)
    },

    selectedCount(): number {
      return this.selectedBehaviors.size
    },

    currentModule(): SurveyModule | undefined {
      return this.modules.find((m) => m.behavior === this.currentBehavior)
    },

    currentQuestion(): BehaviorQuestion | undefined {
      return this.currentModule?.questions[this.currentQuestionIndex]
    },

    currentAnswers(): string[] {
      if (!this.currentBehavior || !this.currentQuestion) return []
      return (
        this.modulesAnswers[this.currentBehavior]?.answers[
          this.currentQuestion.id
        ] ?? []
      )
    },

    canProceed(): boolean {
      return this.currentAnswers.length > 0
    },
  },

  actions: {
    async loadConfig() {
      this.error = null

      try {
        const config = useRuntimeConfig()
        const baseUrl =
          config.public.url.length > 0
            ? config.public.url
            : useRequestURL().origin
        const url = `${baseUrl}/data/survey-config.json`
        this.config = await $fetch(url)
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Unknown error occurred'
        console.error('Error loading survey config:', err)
      }
    },

    toggleBehavior(behavior: Behavior) {
      if (this.selectedBehaviors.has(behavior)) {
        this.selectedBehaviors.delete(behavior)
      } else {
        this.selectedBehaviors.add(behavior)
      }
    },

    clearSelection() {
      this.selectedBehaviors.clear()
    },

    setCurrentBehavior(behavior: Behavior | null) {
      this.currentBehavior = behavior
    },

    setCurrentQuestionIndex(index: number) {
      this.currentQuestionIndex = index
    },

    toggleAnswer(optionId: string) {
      const question = this.currentQuestion
      const behavior = this.currentBehavior
      if (!question || !behavior) return

      // Initialize module answers if needed
      if (!this.modulesAnswers[behavior]) {
        this.modulesAnswers[behavior] = { behavior, answers: {} }
      }
      const moduleAnswers = this.modulesAnswers[behavior]!

      const currentAnswers = moduleAnswers.answers[question.id] ?? []

      if (question.type === 'SINGLE_CHOICE') {
        moduleAnswers.answers[question.id] = [optionId]
      } else {
        if (currentAnswers.includes(optionId)) {
          moduleAnswers.answers[question.id] = currentAnswers.filter(
            (id) => id !== optionId,
          )
        } else {
          moduleAnswers.answers[question.id] = [...currentAnswers, optionId]
        }
      }
    },

    async loadNextModule(): Promise<SurveyModule | null> {
      if (!this.config) return null

      const loadedBehaviors = new Set(this.modules.map((m) => m.behavior))

      const nextRef = this.config.modules.find((ref) => {
        return (
          this.selectedBehaviors.has(ref.behavior) &&
          !loadedBehaviors.has(ref.behavior)
        )
      })

      if (!nextRef) return null

      const config = useRuntimeConfig()
      const baseUrl =
        config.public.url.length > 0
          ? config.public.url
          : useRequestURL().origin
      const url = `${baseUrl}/data/${nextRef.file}`

      const module = await $fetch<SurveyModule>(url)
      this.modules.push(module)

      return module
    },
  },
})
