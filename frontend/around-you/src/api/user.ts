import type { User } from '@/types/user'
import { apiRequest, jsonHeaders } from '@/api/http'

export type UserProfileUpdate = Partial<
  Pick<User, 'userName' | 'email' | 'firstName' | 'lastName' | 'userAvatar'>
>

export const getUserProfile = async (token: string): Promise<User> => {
  return apiRequest<User>('/user/me', {
    method: 'GET',
    token,
    headers: jsonHeaders(),
  })
}

export const updateUserProfile = async (token: string, user: UserProfileUpdate): Promise<User> => {
  return apiRequest<User>('/user/me', {
    method: 'PUT',
    token,
    headers: jsonHeaders(),
    body: JSON.stringify(user),
  })
}
