interface SurveyState {
  config: SurveyConfig | null
  error: string | null
}

export const useSurveyStore = defineStore('survey', {
  state: (): SurveyState => ({
    config: null,
    error: null
  }),

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
  }
})
