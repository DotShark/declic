<script setup lang="ts">
const surveyStore = useSurveyStore()

await callOnce('survey-config', () => surveyStore.loadConfig())
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-6 gap-8">
    <div v-if="surveyStore.error" class="flex flex-col items-center gap-4">
      <Icon name="lucide:alert-circle" size="48" class="text-red-500" />
      <p class="text-red-600">{{ surveyStore.error }}</p>
    </div>

    <div v-else-if="surveyStore.config" class="flex flex-col items-center gap-6 max-w-2xl text-center">
      <Icon name="lucide:brain" size="64" class="text-blue-600" />

      <h1 class="text-4xl font-bold font-family-poppins">
        {{ surveyStore.config.title }}
      </h1>

      <p class="text-lg text-gray-700 font-family-inter">
        {{ surveyStore.config.description }}
      </p>

      <div class="flex items-center gap-2 text-sm text-gray-600">
        <Icon name="lucide:clock" size="20" />
        <span>Environ {{ surveyStore.config.estimatedDurationMinutes }} minutes</span>
      </div>

      <button class="mt-4 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
        Commencer
      </button>
    </div>
  </div>
</template>
