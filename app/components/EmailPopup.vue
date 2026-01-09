<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        @click.self="handleClose"
      >
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all p-8">
          <div class="flex flex-col gap-4">
            <div class="text-center">
              <h2 id="modal-title" class="text-xl font-bold text-gray-800">Finaliser l'envoi</h2>
              <p class="text-gray-500 mt-2 text-sm">
                Entrez votre email pour recevoir vos résultats.
              </p>
            </div>

            <form @submit.prevent="handleSend" class="space-y-4 mt-4" novalidate>
              <div>
                <label for="email-input" class="sr-only">Adresse mail</label>
                <input 
                  id="email-input"
                  type="email" 
                  v-model="email" 
                  placeholder="nom@exemple.com" 
                  required 
                  class="w-full px-4 py-3 rounded-lg border outline-none transition-all"
                  :class="[
                    !isEmailValid && email.length > 0 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                  ]"
                  :disabled="isSending"
                />
                <p v-if="!isEmailValid && email.length > 0" class="text-red-500 text-xs mt-1 ml-1">
                  Veuillez entrer une adresse email valide.
                </p>
              </div>

              <div 
                v-if="message" 
                :class="message.includes('successfully') ? 'text-green-600' : 'text-red-600'"
                class="text-sm text-center font-medium animate-pulse"
                role="alert"
              >
                {{ message }}
              </div>

              <div class="flex flex-col gap-2 pt-2">
                <button 
                  type="submit"
                  :disabled="isSending || !isEmailValid" 
                  class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Icon v-if="isSending" name="svg-spinners:180-ring" />
                  {{ isSending ? 'En cours...' : 'Envoyer les résultats' }}
                </button>
                
                <button 
                  type="button"
                  @click="handleClose" 
                  class="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 font-medium py-3 rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import emailjs from '@emailjs/browser';

const config = useRuntimeConfig()

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'send', email: string): void
}>()

const email = ref('')
const message = ref('')
const isSending = ref(false)

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const mailServiceID = config.public.mailServiceId as string;
const mailTemplateID = config.public.mailTemplateId as string;
const mailPublicKey = config.public.mailPublicKey as string;

const handleClose = () => {
  email.value = ''
  message.value = ''
  emit('close')
}

const handleSend = async () => {
  if (!isEmailValid.value) return
  
  isSending.value = true
  message.value = ''

  try {
    const templateParams = {
      to_email: email.value,
      reply_to: 'votre-email@exemple.com',
      message: `Bonjour ! Nous avons bien reçu votre demande à l'adresse ${email.value}.`,
    };

    await emailjs.send(mailServiceID, mailTemplateID, templateParams, mailPublicKey);
    
    emit('send', email.value)
    message.value = 'Email sent successfully!'
    
    setTimeout(() => {
      handleClose()
    }, 1500)
  } catch (error) {
    console.error('EmailJS Error:', error);
    message.value = 'Échec de l\'envoi. Veuillez réessayer.';
  } finally {
    isSending.value = false
  }
}
</script>