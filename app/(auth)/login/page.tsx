"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import type { LoginCredentials } from "@/types/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, User, Building, Shield, Moon, Sun, Monitor } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

const roleConfig = {
  consumer: {
    title: "Consumer Login",
    description: "Access your loyalty rewards and points",
    icon: User,
    fields: ["email", "password"],
  },
  partner: {
    title: "Partner Login",
    description: "Manage your business loyalty program",
    icon: Building,
    fields: ["email", "password", "organizationCode"],
  },
  admin: {
    title: "Admin Login",
    description: "System administration and management",
    icon: Shield,
    fields: ["email", "password", "accessCode"],
  },
}

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"consumer" | "partner" | "admin">("consumer")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
    role: "admin",
    organizationCode: "",
    accessCode: "",
    rememberMe: false,
  })

  const { login, isLoading, user } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const loginData = {
      email: formData.email,
      password: formData.password,
      ...(selectedRole === "partner" && { organizationCode: formData.organizationCode }),
      ...(selectedRole === "admin" && { accessCode: formData.accessCode }),
      role: selectedRole,
      rememberMe: formData.rememberMe,
    } as any;

    console.log("Submitting login form:", { ...loginData, password: "[REDACTED]" })

    try {
      await login(loginData)
      // Get the user from localStorage or context
      let loggedInUser = user;
      if (!loggedInUser && typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) loggedInUser = JSON.parse(userStr);
      }
      if (loggedInUser?.role === "admin") {
        router.push("/admin")
      } else if (loggedInUser?.role === "partner" || loggedInUser?.role === "seller") {
        
        router.push("/partner")
      } else {
        router.push("/consumer")
      }
    } catch (error) {
      console.error("Login submission error:", error)
      // Error is handled in the auth context
    }
  }

  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const currentConfig = roleConfig[selectedRole]
  const IconComponent = currentConfig.icon

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Image src="/logo.png" alt="LoyaltyPro Logo" width={40} height={40} className="mr-3" />
              <h1 className="text-2xl font-bold text-primary">LoyaltyPro™</h1>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="consumer" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Consumer
                </TabsTrigger>
                <TabsTrigger value="partner" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Partner
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{selectedRole === "consumer" ? "Email or Phone" : "Email"}</Label>
                  <Input
                    id="email"
                    type={selectedRole === "consumer" ? "text" : "email"}
                    placeholder={selectedRole === "consumer" ? "Enter email or phone" : "Enter your email"}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                {selectedRole === "partner" && (
                  <div className="space-y-2">
                    <Label htmlFor="organizationCode">Organization Code</Label>
                    <Input
                      id="organizationCode"
                      type="text"
                      placeholder="Enter organization code"
                      value={formData.organizationCode}
                      onChange={(e) => handleInputChange("organizationCode", e.target.value)}
                      required
                    />
                  </div>
                )}
                {selectedRole === "admin" && (
                  <div className="space-y-2">
                    <Label htmlFor="accessCode">Admin Access Code</Label>
                    <Input
                      id="accessCode"
                      type="text"
                      placeholder="Enter admin access code"
                      value={formData.accessCode}
                      onChange={(e) => handleInputChange("accessCode", e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                    />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              {selectedRole === "consumer" && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline font-medium">
                      Sign up here
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <b>Note:</b> Use your registered email and password to log in as a consumer.
                  </p>
                </div>
              )}
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  <Link href="/docs" className="text-primary hover:underline font-medium">
                    View API Documentation
                  </Link>
                </p>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
