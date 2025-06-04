"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { defaultUsers } from "@/lib/default-users"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "moderator" | "user"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in (from localStorage or session)
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)

      // Set cookie for middleware
      document.cookie = `user=${savedUser}; path=/; max-age=86400`
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if it's a default admin/moderator user
      const defaultUser = defaultUsers.find((u) => u.email === email && u.password === password)

      if (defaultUser) {
        const { password: _, ...userWithoutPassword } = defaultUser
        setUser(userWithoutPassword)

        // Save to localStorage
        const userString = JSON.stringify(userWithoutPassword)
        localStorage.setItem("user", userString)

        // Set cookie for middleware
        document.cookie = `user=${userString}; path=/; max-age=86400`

        // Redirect based on role
        if (userWithoutPassword.role === "admin" || userWithoutPassword.role === "moderator") {
          router.push("/dashboard")
        } else {
          router.push("/movies")
        }

        return true
      }

      // For regular users, check if credentials are provided
      if (email && password) {
        // Check if this user exists in localStorage (previously registered)
        const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
        const existingUser = existingUsers.find((u: any) => u.email === email && u.password === password)

        if (existingUser) {
          const { password: _, ...userWithoutPassword } = existingUser
          setUser(userWithoutPassword)

          // Save to localStorage
          const userString = JSON.stringify(userWithoutPassword)
          localStorage.setItem("user", userString)

          // Set cookie for middleware
          document.cookie = `user=${userString}; path=/; max-age=86400`

          // Redirect to movies page for regular users
          router.push("/movies")

          return true
        }
      }

      return false
    } catch (error) {
      return false
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if email already exists in default users
      const emailExists = defaultUsers.some((u) => u.email === email)
      if (emailExists) {
        return false // Email already exists
      }

      // Check if email exists in registered users
      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const emailExistsInRegistered = existingUsers.some((u: any) => u.email === email)
      if (emailExistsInRegistered) {
        return false // Email already exists
      }

      if (email && password && name) {
        // Create new user with default "user" role
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          password,
          name,
          role: "user" as const,
        }

        // Save to registered users
        const updatedUsers = [...existingUsers, newUser]
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

        // Log in the user
        const { password: _, ...userWithoutPassword } = newUser
        setUser(userWithoutPassword)

        // Save to localStorage
        const userString = JSON.stringify(userWithoutPassword)
        localStorage.setItem("user", userString)

        // Set cookie for middleware
        document.cookie = `user=${userString}; path=/; max-age=86400`

        // Redirect to movies page for new users
        router.push("/movies")

        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")

    // Clear the cookie
    document.cookie = "user=; path=/; max-age=0"

    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
