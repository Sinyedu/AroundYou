import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import RegisterView from '../views/auth/RegisterView.vue'

const registerMock = vi.fn()
const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    register: registerMock,
  }),
}))

const fillForm = async (wrapper: any) => {
  await wrapper.find('#firstName').setValue('John')
  await wrapper.find('#lastName').setValue('Doe')
  await wrapper.find('#userName').setValue('johndoe')
  await wrapper.find('#email').setValue('john@test.com')
  await wrapper.find('#password').setValue('123456')
}

describe('RegisterView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    alertSpy.mockClear()
  })

  it('calls register with correct form data', async () => {
    registerMock.mockResolvedValueOnce(undefined)

    const wrapper = mount(RegisterView)

    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit.prevent')
    await nextTick()

    expect(registerMock).toHaveBeenCalledWith('John', 'Doe', 'johndoe', 'john@test.com', '123456')
  })

  it('shows success alert on successful registration', async () => {
    registerMock.mockResolvedValueOnce(undefined)

    const wrapper = mount(RegisterView)

    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit.prevent')
    await nextTick()

    expect(alertSpy).toHaveBeenCalledWith('Registration successful!')
  })

  it('shows error alert on failed registration', async () => {
    registerMock.mockRejectedValueOnce(new Error('fail'))

    const wrapper = mount(RegisterView)

    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit.prevent')
    await nextTick()

    expect(alertSpy).toHaveBeenCalledWith('Registration failed. Please check your details.')
  })

  it('does not call register if form is empty', async () => {
    const wrapper = mount(RegisterView)

    await wrapper.find('form').trigger('submit.prevent')

    expect(registerMock).not.toHaveBeenCalled()
  })
})
