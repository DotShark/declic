import { defineStore } from 'pinia'
import emailjs from '@emailjs/browser'
import type { ModuleResult } from '~/utils/results'

export const useMailStore = defineStore('mail', () => {
  const config = useRuntimeConfig()

  const email = ref('')
  const statusMessage = ref('')
  const isSending = ref(false)
  const gdprConsent = ref(false)

  const isEmailValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.value)
  })

  const isFormValid = computed(() => {
    return isEmailValid.value && gdprConsent.value
  })

  const resetForm = () => {
    email.value = ''
    statusMessage.value = ''
    gdprConsent.value = false
  }

  const formatResultsForEmail = (results: ModuleResult[]): string => {
    let message = 'Bonjour,\n\nVoici le récapitulatif de vos résultats :\n\n'

    for (const result of results) {
      message += `📋 ${result.moduleName}\n`
      message += `${result.result.text}\n\n`
    }

    message += '---\n'
    message += "Ce questionnaire est un outil d'information, pas un diagnostic.\n"
    message += "Pour toute question, n'hésitez pas à consulter un professionnel de santé."

    return message
  }

  const sendEmail = async (results: ModuleResult[] = []) => {
    if (!isFormValid.value) return false

    isSending.value = true
    statusMessage.value = ''

    try {
      const message =
        results.length > 0
          ? formatResultsForEmail(results)
          : `Bonjour ! Nous avons bien reçu votre demande à l'adresse ${email.value}.`

      const templateParams = {
        to_email: email.value,
        reply_to: 'votre-email@exemple.com',
        message,
      }

      await emailjs.send(
        config.public.mailServiceId as string,
        config.public.mailTemplateId as string,
        templateParams,
        config.public.mailPublicKey as string,
      )

      statusMessage.value = 'Email envoyé avec succès !'
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
    isFormValid,
    gdprConsent,
    sendEmail,
    resetForm,
  }
})
