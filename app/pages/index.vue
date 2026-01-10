<script setup lang="ts">
import { ref, onMounted } from 'vue';
import EmailModal from '~/components/EmailModal.vue';

const surveyStore = useSurveyStore()

const emailModal = ref<InstanceType<typeof EmailModal> | null>(null)

const handleOpenModal = () => {
  if (emailModal.value) {
    emailModal.value.openModal()
  }
}
await callOnce('survey-config', () => surveyStore.loadConfig())
</script>

<template>
  <main
    class="flex min-h-screen flex-col items-center justify-center gap-8 p-6"
  >
    <div
      v-if="surveyStore.error"
      class="flex flex-col items-center gap-4"
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
    </div>

    <div
      v-else-if="surveyStore.config"
      class="flex max-w-2xl flex-col items-center gap-6 text-center"
    >
      <Icon
        name="lucide:brain"
        size="64"
        class="text-blue-600"
        aria-hidden="true"
      />

      <h1 class="font-family-poppins text-4xl font-bold">
        {{ surveyStore.config.title }}
      </h1>

      <p class="font-family-inter text-lg text-gray-700">
        {{ surveyStore.config.description }}
      </p>

      <div class="flex items-center gap-2 text-sm text-gray-600">
        <Icon name="lucide:clock" size="20" aria-hidden="true" />
        <span
          >Environ
          {{ surveyStore.config.estimatedDurationMinutes }} minutes</span
        >
      </div>

      <NuxtLink
        to="/select-modules"
        class="mt-4 inline-block cursor-pointer rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        aria-label="Commencer le questionnaire"
      >
        Commencer
      </NuxtLink>

      <button @click="handleOpenModal">Recevoir mes résultat</button>
      <EmailModal ref="emailModal" />
    </div>
  </main>
</template>