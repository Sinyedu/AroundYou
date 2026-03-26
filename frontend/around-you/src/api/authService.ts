import type { LoginUser, RegisterUser, AuthResponse } from "@/interfaces/auth"
//No clue if this is our endpoint for the backend yet
const API_URL = "http://localhost:4000/api"

export async function registerUser(data: RegisterUser): Promise<string> {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error)
  }

  return result.data
}

export async function loginUser(data: LoginUser): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error)
  }

  return result.data
}
