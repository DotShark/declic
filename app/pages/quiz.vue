<script setup lang="ts">
const router = useRouter()
const surveyStore = useSurveyStore()

// Load first module on mount
await callOnce('quiz-module', async () => {
  const module = await surveyStore.loadNextModule()
  if (module) {
    surveyStore.setCurrentBehavior(module.behavior)
  }
})

async function nextQuestion() {
  const module = surveyStore.currentModule
  if (!module) return

  if (surveyStore.currentQuestionIndex < module.questions.length - 1) {
    surveyStore.setCurrentQuestionIndex(surveyStore.currentQuestionIndex + 1)
  } else {
    const nextModule = await surveyStore.loadNextModule()
    if (nextModule) {
      surveyStore.setCurrentBehavior(nextModule.behavior)
      surveyStore.setCurrentQuestionIndex(0)
    } else {
      router.push('/results')
    }
  }
}

const progress = computed(() => {
  const module = surveyStore.currentModule
  if (!module) return { current: 0, total: 0 }
  return {
    current: surveyStore.currentQuestionIndex + 1,
    total: module.questions.length,
  }
})
</script>

<template>
  <div class="flex flex-col min-h-screen p-6">
    <!-- Loading State -->
    <div
      v-if="!surveyStore.currentModule || !surveyStore.currentQuestion"
      class="flex flex-col items-center justify-center flex-1 gap-4"
    >
      <Icon
        name="lucide:loader-2"
        size="48"
        class="text-blue-600 animate-spin"
        aria-hidden="true"
      />
      <p class="text-gray-600">Chargement du quiz...</p>
    </div>

    <!-- Quiz Content -->
    <main v-else class="flex flex-col max-w-3xl mx-auto w-full gap-8 flex-1">
      <!-- Header with Module Name and Progress -->
      <header class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Icon
              :name="surveyStore.currentModule.icon"
              size="28"
              class="text-blue-600"
              aria-hidden="true"
            />
            <span class="text-lg font-medium text-gray-700 font-family-inter">
              {{ surveyStore.currentModule.name }}
            </span>
          </div>
          <span class="text-sm text-gray-500 font-family-inter">
            Question {{ progress.current }}/{{ progress.total }}
          </span>
        </div>
      </header>

      <!-- Question Component -->
      <QuizQuestion :question="surveyStore.currentQuestion" />

      <!-- Navigation -->
      <nav class="flex flex-col gap-4 mt-auto pt-6">
        <button
          :disabled="!surveyStore.canProceed"
          class="w-full px-8 py-4 font-semibold rounded-lg transition-all"
          :class="{
            'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer':
              surveyStore.canProceed,
            'bg-gray-300 text-gray-500 cursor-not-allowed':
              !surveyStore.canProceed,
          }"
          @click="nextQuestion"
        >
          Suivant
        </button>

        <NuxtLink
          to="/select-modules"
          class="text-center text-gray-600 hover:text-gray-900 font-family-inter"
        >
          Quitter le quiz
        </NuxtLink>
      </nav>
    </main>
  </div>
</template>
