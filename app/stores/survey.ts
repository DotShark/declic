interface SurveyState {
  config: SurveyConfig | null
  error: string | null
  selectedBehaviors: Set<Behavior>
}

export const useSurveyStore = defineStore('survey', {
  state: (): SurveyState => ({
    config: null,
    error: null,
    selectedBehaviors: new Set()
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
  },

  actions: {
    async loadConfig() {
      this.error = null

      try {
        const { origin } = useRequestURL()
        const url = `${origin}/data/survey-config.json`
        this.config = await $fetch(url)
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Unknown error occurred'
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
  }
})
