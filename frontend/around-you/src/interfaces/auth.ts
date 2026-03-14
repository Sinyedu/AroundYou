export interface RegisterUser {
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
}

export interface LoginUser {
  email: string
  password: string
}

export interface AuthResponse {
  userId: string
  token: string
}
