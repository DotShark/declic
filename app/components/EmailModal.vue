<script setup lang="ts">
import type { ModuleResult } from '~/utils/results'

const props = defineProps<{
  results?: ModuleResult[]
}>()

const mailStore = useMailStore()
const isOpen = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const openModal = () => {
  isOpen.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const closeModal = () => {
  isOpen.value = false
  mailStore.resetForm()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) closeModal()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

const handleSubmit = async () => {
  const success = await mailStore.sendEmail(props.results ?? [])
  if (success) {
    setTimeout(() => closeModal(), 2000)
  }
}

defineExpose({ openModal })
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="closeModal"
    >
      <div
        class="relative w-full max-w-md rounded-xl bg-white p-8 shadow-2xl text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
          aria-label="Fermer la fenêtre"
          @click="closeModal"
        >
          <div class="w-6 h-6">
            <Icon name="lucide:x" size="24" aria-hidden="true" />
          </div>
        </button>

        <h2 id="modal-title" class="text-xl font-semibold text-gray-800 mb-2">
          Recevoir mes résultats
        </h2>
        <p class="text-gray-600 mb-6">
          Entrez votre email pour recevoir votre compte-rendu personnalisé.
        </p>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-3">
            <label for="email-input" class="sr-only">Votre adresse email</label>
            <input
              id="email-input"
              ref="inputRef"
              v-model="mailStore.email"
              type="email"
              placeholder="nom@email.com"
              :disabled="mailStore.isSending"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              :class="[
                mailStore.email && !mailStore.isEmailValid
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300',
              ]"
              aria-required="true"
            />

            <!-- GDPR Consent Checkbox -->
            <button
              type="button"
              class="flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer text-left w-full"
              :class="[
                mailStore.gdprConsent
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-gray-400',
              ]"
              :disabled="mailStore.isSending"
              @click="mailStore.gdprConsent = !mailStore.gdprConsent"
            >
              <div class="w-6 h-6 shrink-0 mt-0.5">
                <Icon
                  :name="
                    mailStore.gdprConsent
                      ? 'lucide:check-square'
                      : 'lucide:square'
                  "
                  size="24"
                  :class="
                    mailStore.gdprConsent ? 'text-blue-600' : 'text-gray-400'
                  "
                />
              </div>
              <span class="text-sm text-gray-700 font-family-inter">
                J'accepte que mon adresse email soit utilisée uniquement pour
                l'envoi de mes résultats. Elle ne sera pas conservée ni utilisée
                à d'autres fins.
                <span class="text-red-500">*</span>
              </span>
            </button>

            <button
              type="submit"
              :disabled="!mailStore.isFormValid || mailStore.isSending"
              class="w-full py-3 px-6 rounded-lg font-bold text-white transition-all transform active:scale-[0.98]"
              :class="[
                mailStore.isFormValid && !mailStore.isSending
                  ? 'bg-[#00dc82] hover:bg-[#00c575] shadow-md'
                  : 'bg-gray-300 cursor-not-allowed',
              ]"
            >
              <span
                v-if="mailStore.isSending"
                class="flex items-center justify-center gap-2"
              >
                <div class="w-5 h-5">
                  <Icon name="lucide:loader-2" size="20" class="animate-spin" />
                </div>
                En cours d'envoi...
              </span>
              <span v-else>Soumettre</span>
            </button>
          </div>

          <Transition
            enter-active-class="transition duration-200"
            enter-from-class="transform -translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
          >
            <p
              v-if="mailStore.statusMessage"
              class="text-sm font-medium p-2 rounded"
              :class="
                mailStore.statusMessage.includes('Échec')
                  ? 'text-red-600 bg-red-50'
                  : 'text-emerald-700 bg-emerald-50'
              "
              role="status"
            >
              {{ mailStore.statusMessage }}
            </p>
          </Transition>
        </form>
      </div>
    </div>
  </Transition>
</template>
