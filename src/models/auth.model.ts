export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}