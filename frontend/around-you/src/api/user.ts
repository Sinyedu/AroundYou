const apiUrl = 'http://localhost:4000/api/user'

export type User = {
  id: string
  userName: string
  email: string
  firstName: string
  lastName: string
}

export const getUserProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${apiUrl}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }

  return response.json()
}

export const updateUserProfile = async (token: string, user: Partial<User>) => {
  const response = await fetch(`${apiUrl}/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    throw new Error('Failed to update user')
  }

  return response.json()
}
