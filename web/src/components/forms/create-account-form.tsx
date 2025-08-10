import { IconEye, IconEyeOff, IconLoader } from "@tabler/icons-react"
import { useForm } from "@tanstack/react-form"
import { Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import z from "zod"

import { useAuth } from "@web/lib/auth/AuthProvider"
import { FieldInfo } from "@web/lib/forms"

import { Button } from "@web/components/ui/button"
import { Input } from "@web/components/ui/input"

import { USERNAME_REGEX } from "@sdk/core"

interface CreateAccountData {
  displayName: string
  username: string
  email: string
  password: string
  terms: boolean
}

const defaultFormData: CreateAccountData = {
  displayName: '',
  username: '',
  email: '',
  password: '',
  terms: false
}

// Validation schemas
const signupSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(16, "Username must be at most 16 characters")
    .regex(USERNAME_REGEX, "Username can only contain letters, numbers, dots, and underscores"),
  email: z.email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
  terms: z.boolean().refine(val => val === true, "You must agree to the terms and privacy policy")
})

export const safecheckEmail = (x: string) => z.email().safeParse(x)
export const safecheckUsername = (x: string) => z.string().regex(USERNAME_REGEX).safeParse(x)

export function CreateAccountForm() {
  const { signup, socialLogin, loading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSocialLogin = async (provider: 'github') => {
    clearError()
    const success = await socialLogin(provider)
    if (success) {
      navigate({ to: "/home" })
    }
  }

  const form = useForm({
    defaultValues: defaultFormData,
    validators: {
      onSubmit: ({ value }) => {
        const validation = signupSchema.safeParse(value)
        if (!validation.success) {
          return validation.error.issues[0]?.message || 'Validation failed'
        }
        return undefined
      }
    },
    onSubmit: async ({ value }) => {
      clearError()

      // Validate the form data
      const validation = signupSchema.safeParse(value)
      if (!validation.success) {
        console.error('Validation failed:', validation.error)
        return
      }

      // Call the signup function
      const success = await signup(
        validation.data.email,
        validation.data.password,
        validation.data.displayName
      )

      if (success) {
        // Navigate to dashboard or home page on successful signup
        navigate({ to: "/home" })
      }
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground text-sm">
          Welcome! It's always a good time to start anew.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4">

        {/* Display Name Field */}
        <form.Field
          name="displayName"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Display name is required'
              if (value.length < 2) return 'Display name must be at least 2 characters'
              if (value.length > 50) return 'Display name must be at most 50 characters'
              return undefined
            }
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={loading}
                placeholder="Your Name"
                className={field.state.meta.errors.length > 0 ? "border-destructive" : ""}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        {/* Username Field */}
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Username is required'
              const result = safecheckUsername(value)
              if (!result.success) return 'Username can only contain letters, numbers, dots, and underscores'
              if (value.length < 3) return 'Username must be at least 3 characters'
              if (value.length > 16) return 'Username must be at most 16 characters'
              return undefined
            },
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              if (!value || value.length < 3) return undefined

              // Simulate username availability check
              await new Promise((resolve) => setTimeout(resolve, 500))

              // TODO: Implement actual username availability check
              if (value.toLowerCase() === 'admin' || value.toLowerCase() === 'root') {
                return 'This username is not available'
              }

              return undefined
            }
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Username"
                disabled={loading}
                className={field.state.meta.errors.length > 0 ? "border-destructive" : ""}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        {/* Email Field */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Email is required'
              const result = safecheckEmail(value)
              if (!result.success) return 'Please enter a valid email address'
              return undefined
            }
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Email"
                disabled={loading}
                className={field.state.meta.errors.length > 0 ? "border-destructive" : ""}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        {/* Password Field */}
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Password is required'
              if (value.length < 8) return 'Password must be at least 8 characters'
              return undefined
            }
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Password"
                  disabled={loading}
                  className={`pr-10 ${field.state.meta.errors.length > 0 ? "border-destructive" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <IconEyeOff className="size-6" />
                  ) : (
                    <IconEye className="size-6" />
                  )}
                </Button>
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
            {error}
          </div>
        )}

        {/* Form Validation Error */}
        <form.Subscribe
          selector={(state) => [state.errorMap]}
        >
          {([errorMap]) => errorMap?.onSubmit ? (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
              {errorMap.onSubmit}
            </div>
          ) : null}
        </form.Subscribe>

        {/* Submit Button */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="w-full font-bold"
              disabled={!canSubmit || isSubmitting || loading}
            >
              {loading || isSubmitting ? (
                <>
                  <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "CREATE ACCOUNT"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleSocialLogin('github')}
          disabled={loading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Continue with GitHub
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          <img
            className="mr-2 h-4 w-4"
            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg"
            alt="Google"
          />
          Continue with Google
        </Button>
      </div>

      {/* Sign In Link */}
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </div>
  )
}