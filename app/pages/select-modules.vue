<script setup lang="ts">
const surveyStore = useSurveyStore()
const router = useRouter()

await callOnce('survey-config', () => surveyStore.loadConfig())

// Toggle handler
const handleToggle = (behavior: Behavior) => {
  surveyStore.toggleBehavior(behavior)
}

// Navigation handler
const handleStartQuiz = () => {
  if (surveyStore.hasSelection) {
    router.push('/quiz')
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col p-6">
    <!-- Error State -->
    <div
      v-if="surveyStore.error"
      class="flex flex-1 flex-col items-center justify-center gap-4"
      role="alert"
      aria-live="assertive"
    >
      <Icon
        name="lucide:alert-circle"
        size="48"
        class="text-red-500"
        aria-hidden="true"
      />
      <p class="text-red-600">{{ surveyStore.error }}</p>
      <NuxtLink to="/" class="text-blue-600 underline"
        >Retour à l'accueil</NuxtLink
      >
    </div>

    <!-- Main Content -->
    <main
      v-else-if="surveyStore.config"
      class="mx-auto flex w-full max-w-3xl flex-col gap-8"
    >
      <!-- Title Section -->
      <header class="flex flex-col gap-4">
        <h1 class="font-family-poppins text-3xl font-bold text-gray-900">
          Sélectionne les comportements sur lesquels tu souhaites faire le point
        </h1>
        <p class="font-family-inter text-base text-gray-600">
          Tu peux en choisir plusieurs. Plus tu en sélectionnes, plus le quiz
          sera complet.
        </p>
      </header>

      <!-- Module List -->
      <div
        class="flex flex-col gap-3"
        role="group"
        aria-label="Liste des comportements disponibles"
      >
        <button
          v-for="module in surveyStore.config.modules"
          :key="module.behavior"
          @click="handleToggle(module.behavior)"
          class="flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all"
          :class="{
            'border-blue-600 bg-blue-50': surveyStore.isSelected(
              module.behavior,
            ),
            'border-gray-300 bg-white hover:border-gray-400':
              !surveyStore.isSelected(module.behavior),
          }"
          :aria-pressed="surveyStore.isSelected(module.behavior)"
          :aria-label="`${module.name}: ${surveyStore.isSelected(module.behavior) ? 'sélectionné' : 'non sélectionné'}`"
        >
          <!-- Icon -->
          <div class="shrink-0">
            <Icon
              :name="module.icon"
              size="32"
              :class="{
                'text-blue-600': surveyStore.isSelected(module.behavior),
                'text-gray-600': !surveyStore.isSelected(module.behavior),
              }"
              aria-hidden="true"
            />
          </div>

          <!-- Module Name -->
          <span
            class="font-family-inter flex-1 text-left text-lg font-medium"
            :class="{
              'text-gray-900': surveyStore.isSelected(module.behavior),
              'text-gray-700': !surveyStore.isSelected(module.behavior),
            }"
          >
            {{ module.name }}
          </span>

          <!-- Checkbox -->
          <div class="shrink-0">
            <Icon
              :name="
                surveyStore.isSelected(module.behavior)
                  ? 'lucide:check-circle-2'
                  : 'lucide:circle'
              "
              size="24"
              :class="{
                'text-blue-600': surveyStore.isSelected(module.behavior),
                'text-gray-400': !surveyStore.isSelected(module.behavior),
              }"
              aria-hidden="true"
            />
          </div>
        </button>
      </div>

      <!-- CTA Section -->
      <nav class="mt-4 flex flex-col gap-4">
        <button
          @click="handleStartQuiz"
          :disabled="!surveyStore.hasSelection"
          class="w-full rounded-lg px-8 py-4 font-semibold transition-all"
          :class="{
            'cursor-pointer bg-blue-600 text-white hover:bg-blue-700':
              surveyStore.hasSelection,
            'cursor-not-allowed bg-gray-300 text-gray-500':
              !surveyStore.hasSelection,
          }"
          :aria-label="
            surveyStore.hasSelection
              ? `Commencer le quiz avec ${surveyStore.selectedCount} comportement${surveyStore.selectedCount > 1 ? 's' : ''} sélectionné${surveyStore.selectedCount > 1 ? 's' : ''}`
              : 'Commencer le quiz - Veuillez sélectionner au moins un comportement'
          "
        >
          Commencer le quiz
        </button>

        <NuxtLink
          to="/"
          class="font-family-inter text-center text-gray-600 hover:text-gray-900"
          aria-label="Retourner à la page d'accueil"
        >
          Retour à l'accueil
        </NuxtLink>
      </nav>
    </main>
  </div>
</template>
