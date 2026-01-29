<script setup lang="ts">
import { computeAllResults } from '~/utils/results'
import EmailModal from '~/components/EmailModal.vue'

useHead({
  title: 'Résultats - Declic',
  meta: [
    {
      name: 'description',
      content:
        'Consulte tes résultats personnalisés et découvre les ressources adaptées à tes besoins.',
    },
  ],
})

const router = useRouter()
const surveyStore = useSurveyStore()

// Compute results from store data
const results = computed(() =>
  computeAllResults(surveyStore.modules, surveyStore.modulesAnswers),
)

// Redirect if no results (direct navigation or empty state)
onMounted(() => {
  if (results.value.length === 0) {
    router.replace('/select-modules')
  }
})

const handleRestart = () => {
  surveyStore.resetQuiz()
  router.push('/select-modules')
}

// Email modal
const emailModal = ref<InstanceType<typeof EmailModal> | null>(null)

const handleOpenEmailModal = () => {
  if (emailModal.value) {
    emailModal.value.openModal()
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen p-6">
    <!-- Empty State -->
    <div
      v-if="results.length === 0"
      class="flex flex-col items-center justify-center flex-1 gap-4"
    >
      <div class="w-12 h-12">
        <Icon
          name="lucide:clipboard-list"
          size="48"
          class="text-gray-400"
          aria-hidden="true"
        />
      </div>
      <p class="text-gray-600 font-family-inter">
        Tu n'as pas encore complété de modules.
      </p>
      <NuxtLink
        to="/select-modules"
        class="text-blue-600 hover:text-blue-700 underline font-family-inter"
      >
        Retourner au quiz
      </NuxtLink>
    </div>

    <!-- Results Content -->
    <main v-else class="flex flex-col max-w-3xl mx-auto w-full gap-8">
      <!-- Header -->
      <header class="flex flex-col items-center gap-4 text-center">
        <div class="w-16 h-16">
          <Icon
            name="lucide:heart"
            size="64"
            class="text-emerald-500"
            aria-hidden="true"
          />
        </div>
        <h1 class="text-3xl font-bold font-family-poppins text-gray-900">
          Tes résultats
        </h1>
        <p class="text-base text-gray-600 font-family-inter max-w-lg">
          Voici un aperçu de tes réponses. N'oublie pas : ce questionnaire est
          un outil d'information, pas un diagnostic.
        </p>
      </header>

      <!-- Results Cards -->
      <section class="flex flex-col gap-4" aria-label="Résultats par module">
        <ResultCard
          v-for="result in results"
          :key="result.behavior"
          :module-name="result.moduleName"
          :icon="result.icon"
          :result-text="result.result.text"
        />
      </section>

      <!-- Actions -->
      <nav class="flex flex-col gap-4 mt-4">
        <button
          class="w-full px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          @click="handleOpenEmailModal"
        >
          Recevoir mes résultats par email
        </button>

        <button
          class="w-full px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-all"
          @click="handleRestart"
        >
          Recommencer le quiz
        </button>

        <NuxtLink
          to="/"
          class="text-center text-gray-600 hover:text-gray-900 font-family-inter py-2"
        >
          Retour à l'accueil
        </NuxtLink>
      </nav>
    </main>

    <EmailModal ref="emailModal" :results="results" />
  </div>
</template>
