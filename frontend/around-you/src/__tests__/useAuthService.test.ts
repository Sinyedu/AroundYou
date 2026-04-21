import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthService } from '../api/authService'

// Mock utils
vi.mock('@/utils/auth', () => ({
  getJwtPayload: vi.fn(() => ({ role: 'user' })),
  payloadHasAdminAccess: vi.fn(() => false),
}))

describe('useAuthService', () => {
  let auth: ReturnType<typeof useAuthService>

  beforeEach(() => {
    vi.restoreAllMocks()

    auth = useAuthService()

    // Mock localStorage
    const store: Record<string, string> = {}

    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      removeItem: (key: string) => {
        delete store[key]
      },
    })
  })

  it('logs in successfully and stores token + user data', async () => {
    const mockResponse = {
      token: 'fake-jwt-token',
      user: {
        id: '1',
        userName: 'testUser',
        email: 'test@test.com',
        userAvatar: 'avatar.png',
      },
    }

    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    )

    vi.stubGlobal('fetch', fetchMock as any)

    const result = await auth.login('testUser', 'password')

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/api/user/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          identifier: 'testUser',
          password: 'password',
        }),
      }),
    )

    expect(result.token).toBe('fake-jwt-token')
    expect(auth.token.value).toBe('fake-jwt-token')
    expect(localStorage.getItem('token')).toBe('fake-jwt-token')
    expect(localStorage.getItem('userName')).toBe('testUser')
    expect(localStorage.getItem('userAvatar')).toBe('avatar.png')
  })

  it('removes avatar if not provided', async () => {
    const mockResponse = {
      token: 'fake-jwt-token',
      user: {
        id: '1',
        userName: 'testUser',
        email: 'test@test.com',
      },
    }

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        }),
      ) as any,
    )

    await auth.login('testUser', 'password')

    expect(localStorage.getItem('userAvatar')).toBe(null)
  })

  it('throws error on failed login', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: 'Invalid credentials' }),
        }),
      ) as any,
    )

    await expect(auth.login('wrong', 'wrong')).rejects.toThrow('Invalid credentials')
  })

  it('throws on network failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('Network error'))),
    )

    await expect(auth.login('test', 'test')).rejects.toThrow('Network error')
  })

  it('throws if API response is malformed (missing token)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: {} }),
        }),
      ) as any,
    )

    await expect(auth.login('test', 'test')).rejects.toThrow()
  })

  it('does not crash if logout is called twice', () => {
    auth.logout()
    auth.logout()

    expect(auth.token.value).toBe(null)
  })

  it('registers successfully', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as any,
    )

    await expect(auth.register('a', 'b', 'user', 'test@test.com', '123')).resolves.toBeUndefined()
  })

  it('throws if registration fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
        }),
      ) as any,
    )

    await expect(auth.register('a', 'b', 'user', 'test@test.com', '123')).rejects.toThrow(
      'Registration failed',
    )
  })
})
