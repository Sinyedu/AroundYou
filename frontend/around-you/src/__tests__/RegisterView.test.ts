import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import RegisterView from '../views/auth/RegisterView.vue'

const registerMock = vi.fn()

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    register: registerMock,
  }),
}))

const mountRegisterView = () =>
  mount(RegisterView, {
    global: {
      stubs: {
        RouterLink: {
          props: ['to'],
          template: '<a><slot /></a>',
        },
      },
    },
  })

const fillForm = async (wrapper: VueWrapper) => {
  await wrapper.find('#firstName').setValue('John')
  await wrapper.find('#lastName').setValue('Doe')
  await wrapper.find('#userName').setValue('johndoe')
  await wrapper.find('#email').setValue('john@test.com')
  await wrapper.find('#password').setValue('123456')
}

describe('RegisterView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls register with correct form data', async () => {
    registerMock.mockResolvedValueOnce(undefined)

    const wrapper = mountRegisterView()

    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(registerMock).toHaveBeenCalledWith('John', 'Doe', 'johndoe', 'john@test.com', '123456')
  })

  it('shows success message on successful registration', async () => {
    registerMock.mockResolvedValueOnce(undefined)

    const wrapper = mountRegisterView()

    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Din konto er oprettet. Du kan logge ind nu.')
  })

  it('shows error message on failed registration', async () => {
    registerMock.mockRejectedValueOnce(new Error('fail'))

    const wrapper = mountRegisterView()

    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('fail')
  })

  it('does not call register if form is empty', async () => {
    const wrapper = mountRegisterView()

    await wrapper.find('form').trigger('submit.prevent')

    expect(registerMock).not.toHaveBeenCalled()
  })
})
