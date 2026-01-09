<template>
  <main class="flex flex-col items-center justify-center min-h-screen p-6 gap-8">
    <div v-if="surveyStore.error" class="flex flex-col items-center gap-4" role="alert" aria-live="assertive">
      <Icon name="lucide:alert-circle" size="48" class="text-red-500" aria-hidden="true" />
      <p class="text-red-600">{{ surveyStore.error }}</p>
    </div>

    <div v-else-if="surveyStore.config" class="flex flex-col items-center gap-6 max-w-2xl text-center">
      <Icon name="lucide:brain" size="64" class="text-blue-600" aria-hidden="true" />

      <h1 class="text-4xl font-bold font-family-poppins">
        {{ surveyStore.config.title }}
      </h1>

      <p class="text-lg text-gray-700 font-family-inter">
        {{ surveyStore.config.description }}
      </p>

      <div class="flex items-center gap-2 text-sm text-gray-600">
        <Icon name="lucide:clock" size="20" aria-hidden="true" />
        <span>Environ {{ surveyStore.config.estimatedDurationMinutes }} minutes</span>
      </div>

      <NuxtLink
        to="/select-modules"
        class="mt-4 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
        aria-label="Commencer le questionnaire"
      >
        Commencer
      </NuxtLink>

      <button 
        @click="openPopup"
        class="mt-4 px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors cursor-pointer inline-block"
        aria-label="Récupérer vos résultats"
      >
        Récupérer vos résultats
      </button>

      <EmailPopup 
      :isOpen="popupOpen" 
      @close="popupOpen = false" 
      @send="handleEmailSend" 
    />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import EmailPopup from '../components/EmailPopup.vue';

const surveyStore = useSurveyStore()

onMounted(() => {
  surveyStore.loadConfig()
})

const popupOpen = ref(false);

const openPopup = () => {
  popupOpen.value = true;
};

const handleEmailSend = (email: string) => {
  console.log('Email sent to:', email);
}

onMounted(() => {
  surveyStore.loadConfig();
});
</script>