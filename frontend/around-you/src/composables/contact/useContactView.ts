import { computed, reactive, ref } from 'vue'

import { createContactTicket } from '@/api/contactTickets.api'
import { useAuth } from '@/composables/useAuth'
import {
  contactTicketCategoryOptions,
  getContactTicketCategoryMeta,
  type CreateContactTicketPayload,
} from '@/types/contact-ticket'

export function useContactView() {
  const { currentUser } = useAuth()

  const isSubmitting = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  const form = reactive<CreateContactTicketPayload>({
    category: 'bug',
    subject: '',
    message: '',
  })

  const userEmail = computed(() => currentUser.value?.email ?? 'din konto-email')
  const displayUserName = computed(() => currentUser.value?.userName ?? 'Bruger')
  const selectedCategory = computed(() => getContactTicketCategoryMeta(form.category))
  const previewDate = computed(() =>
    new Date().toLocaleString('da-DK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
  )
  const previewSubject = computed(() => form.subject || 'Din titel vises her')
  const previewMessage = computed(
    () =>
      form.message ||
      'Din beskrivelse vises her, mens du skriver. Admin modtager teksten sammen med din kategori, titel og konto-email.',
  )

  const submitTicket = async (): Promise<void> => {
    isSubmitting.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      await createContactTicket({ ...form })
      form.subject = ''
      form.message = ''
      successMessage.value = 'Din henvendelse er sendt til admin.'
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Kunne ikke sende henvendelsen.'
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    contactTicketCategoryOptions,
    displayUserName,
    errorMessage,
    form,
    isSubmitting,
    previewDate,
    previewMessage,
    previewSubject,
    selectedCategory,
    submitTicket,
    successMessage,
    userEmail,
  }
}
