export interface User {
  id: number
  name: string
  email: string
  role: "consumer" | "partner" | "admin"
  permissions?: string[]
  lastLogin?: string
}

export interface ConsumerUser extends User {
  role: "consumer"
  points: number
  tier: "Bronze" | "Silver" | "Gold" | "Platinum"
  memberSince: string
  cardNumber: string
  phone?: string
  dateOfBirth?: string
}

export interface PartnerUser extends User {
  role: "partner"
  organization: string
  organizationCode: string
}

export interface AdminUser extends User {
  role: "admin"
  accessLevel: "full" | "limited"
}

export interface LoginCredentials {
  email: string
  password: string
  role: User["role"]
  organizationCode?: string
  accessCode?: string
  rememberMe?: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  dateOfBirth?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Backend API interfaces
export interface BackendLoginRequest {
  username: string
  password: string
}

export interface BackendLoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    roles: string[];
  };
}

export interface BackendErrorResponse {
  message: string
  code?: string
}
