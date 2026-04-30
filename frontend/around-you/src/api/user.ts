import type { User } from '@/types/user'
const API_URL = 'http://localhost:4000/api/user'

export type UserProfileUpdate = Partial<
  Pick<User, 'userName' | 'email' | 'firstName' | 'lastName' | 'userAvatar'>
>

export const getUserProfile = async (token: string): Promise<User> => {
  const res = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('Unauthorized / Failed fetching user')
  }

  return (await res.json()) as User
}

export const updateUserProfile = async (
  token: string,
  user: UserProfileUpdate,
): Promise<User> => {
  const res = await fetch(`${API_URL}/me`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })

  if (!res.ok) {
    throw new Error('Failed to update user profile')
  }

  return await res.json()
}
