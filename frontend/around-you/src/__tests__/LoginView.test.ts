import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '../views/auth/LoginView.vue'

// Mocks
const pushMock = vi.fn()
const loginMock = vi.fn()
const getLocationMock = vi.fn()

const isAuthenticated = { value: true }

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    login: loginMock,
    isAuthenticated,
  }),
}))

vi.mock('@/stores/geolocation', () => ({
  useGeolocationStore: () => ({
    getLocation: getLocationMock,
  }),
}))

describe('LoginView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    isAuthenticated.value = true
  })

  it('submits form and logs in user', async () => {
    loginMock.mockResolvedValueOnce(undefined)

    const wrapper = mount(LoginView)

    await wrapper.find('#email').setValue('testUser')
    await wrapper.find('#password').setValue('password')

    await wrapper.find('form').trigger('submit.prevent')

    expect(loginMock).toHaveBeenCalledWith('testUser', 'password')
    expect(getLocationMock).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith('/')
  })

  it('does not submit if fields are empty', async () => {
    const wrapper = mount(LoginView)

    await wrapper.find('form').trigger('submit.prevent')

    expect(loginMock).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('does not redirect if login fails', async () => {
    loginMock.mockRejectedValueOnce(new Error('Invalid credentials'))

    const wrapper = mount(LoginView)

    await wrapper.find('#email').setValue('wrong')
    await wrapper.find('#password').setValue('wrong')

    await wrapper.find('form').trigger('submit.prevent')

    expect(pushMock).not.toHaveBeenCalled()
    expect(getLocationMock).not.toHaveBeenCalled()
  })

  it('does not redirect if not authenticated', async () => {
    isAuthenticated.value = false
    loginMock.mockResolvedValueOnce(undefined)

    const wrapper = mount(LoginView)

    await wrapper.find('#email').setValue('testUser')
    await wrapper.find('#password').setValue('password')

    await wrapper.find('form').trigger('submit.prevent')

    expect(pushMock).not.toHaveBeenCalled()
  })
})
