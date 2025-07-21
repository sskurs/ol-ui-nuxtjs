"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { User, AuthState, LoginCredentials, RegisterData } from "@/types/auth"
import { authAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_TOKEN"; payload: string | null }
  | { type: "LOGOUT" }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      }
    case "SET_TOKEN":
      return { ...state, token: action.payload }
    case "LOGOUT":
      return {
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const { toast } = useToast()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        dispatch({ type: "SET_TOKEN", payload: token })
        try {
          const user = await authAPI.getProfile()
          dispatch({ type: "SET_USER", payload: user })
        } catch (error) {
          localStorage.removeItem("token")
          dispatch({ type: "LOGOUT" })
        }
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      console.log("Attempting login with:", { ...credentials, password: "[REDACTED]" })
      const response = await authAPI.login(credentials)
      console.log("Login response:", response)

      if (!response.token || !response.user) {
        throw new Error("Invalid response from server")
      }

      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user)) // <-- Store user in localStorage
      dispatch({ type: "SET_TOKEN", payload: response.token })
      dispatch({ type: "SET_USER", payload: response.user })

      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${response.user.name}`,
      })
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const register = async (data: RegisterData) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      await authAPI.register(data)

      toast({
        title: "Account created!",
        description: "Please log in with your new credentials",
      })
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    dispatch({ type: "LOGOUT" })

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authAPI.updateProfile(data)
      dispatch({ type: "SET_USER", payload: updatedUser })

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
