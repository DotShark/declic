interface SurveyState {
  config: SurveyConfig | null
  error: string | null
  selectedBehaviors: Set<Behavior>
  modules: SurveyModule[]
  currentBehavior: Behavior | null
  currentQuestionIndex: number
}

export const useSurveyStore = defineStore('survey', {
  state: (): SurveyState => ({
    config: null,
    error: null,
    selectedBehaviors: new Set(),
    modules: [],
    currentBehavior: null,
    currentQuestionIndex: 0,
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
