const API_URL = 'http://localhost:4000/api/user'

export type User = {
  id: string
  userName: string
  email: string
  firstName?: string
  lastName?: string
  userAvatar?: string
}

export const getUserProfile = async (token: string) => {
  const res = await fetch('http://localhost:4000/api/user/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('Unauthorized / Failed fetching user')
  }

  return res.json()
}

export const updateUserProfile = async (token: string, user: User): Promise<User> => {
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
