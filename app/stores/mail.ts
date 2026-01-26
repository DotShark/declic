import { defineStore } from 'pinia'
import emailjs from '@emailjs/browser'

export const useMailStore = defineStore('mail', () => {
  const config = useRuntimeConfig()

  const email = ref('')
  const statusMessage = ref('')
  const isSending = ref(false)

  const isEmailValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.value)
  })

  const resetForm = () => {
    email.value = ''
    statusMessage.value = ''
  }

  const sendEmail = async () => {
    if (!isEmailValid.value) return

    isSending.value = true
    statusMessage.value = ''

    try {
      const templateParams = {
        to_email: email.value,
        reply_to: 'votre-email@exemple.com',
        message: `Bonjour ! Nous avons bien reçu votre demande à l'adresse ${email.value}.`,
      }

      await emailjs.send(
        config.public.mailServiceId as string,
        config.public.mailTemplateId as string,
        templateParams,
        config.public.mailPublicKey as string,
      )

      statusMessage.value = 'Email sent successfully!'
      return true
    } catch (error) {
      console.error('EmailJS Error:', error)
      statusMessage.value = "Échec de l'envoi. Veuillez réessayer."
      return false
    } finally {
      isSending.value = false
    }
  }

  return {
    email,
    statusMessage,
    isSending,
    isEmailValid,
    sendEmail,
    resetForm,
  }
})
