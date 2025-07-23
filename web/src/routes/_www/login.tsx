
import { Button } from "@web/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@web/components/ui/card"
import { Input } from "@web/components/ui/input"
import { Label } from "@web/components/ui/label"

import { USERNAME_REGEX } from "@sdk/core"
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from "@web/lib/auth/AuthProvider"
import z from "zod"

export const Route = createFileRoute('/_www/login')({ component: Page })

interface Credentials {
  loginName: string | null,
  password: string | null
}

const defaultCredentials: Credentials = {
  loginName: null,
  password: null
}


function Page() {
  const { login, socialLogin, loading, error, clearError } = useAuth()

  useForm({
    defaultValues: defaultCredentials,
    onSubmit: async ({ value }) => {
      if (!value.loginName || !value.password)
        return // Set error and return

      // Validate loginName as email or username
      const safecheckEmail = z.email().trim().safeParse(value.loginName)
      const safecheckUsername = z.string().trim().regex(USERNAME_REGEX).safeParse(value.loginName)

      if (safecheckEmail.success) // detailed email check with zod instead
      {
        login({ email: safecheckEmail.data, password: value.password })
      }
      else if (value.loginName) // Username regex check instead
      {
        login({ username: value.loginName, password: value.password })
      }
    },
  })

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginName || !password) return

    // Validate loginName as email or username
    const safecheckEmail = z.email().trim().safeParse(loginName)
    const safecheckUsername = z.string().trim().regex(USERNAME_REGEX).safeParse(loginName)

    clearError();

    if (safecheckEmail.success) {
      const success = await login({ email: safecheckEmail.data, password });
    }

    else if (safecheckUsername.success) {
      const success = await login({ username: safecheckUsername.data, password })
    }

    else {
      // can not login with this loginName
      error = "Invalid email or username"
    }
    if (success) {
      navigate({ to: "/home" });
    }
  }

  const handleSocialLogin = async (provider: 'github') => {
    clearError();
    const success = await socialLogin(provider);
    if (success) {
      navigate({ to: "/" });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginName}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Social and wallet login buttons, stacked vertically */}
          <div className="my-6 flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleSocialLogin('github')}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" fill="#1877F2" /><path d="M15.803 14.89l.443-2.89h-2.773v-1.875c0-.791.388-1.562 1.63-1.562h1.26v-2.46s-1.144-.195-2.238-.195c-2.285 0-3.777 1.384-3.777 3.89v2.173h-2.54v2.89h2.54v6.987A10.003 10.003 0 0 0 12 22c5.523 0 10-4.477 10-10 0-4.991-3.657-9.128-8.438-9.877v6.987h2.54z" fill="#fff" /></svg>
              Continue with GitHub
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2" disabled>
              <svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="60" fill="#F6851B" /><path d="M204.6 104.6c-2.1-4.7-7.7-6.6-12.4-4.5l-23.2 10.2c-2.2.9-4.7.7-6.7-.6l-13.2-8.2c-1.9-1.2-3.1-3.2-3.1-5.4V80.2c0-5.1-4.1-9.2-9.2-9.2h-24.2c-5.1 0-9.2 4.1-9.2 9.2v16.1c0 2.2-1.2 4.2-3.1 5.4l-13.2 8.2c-2 .9-4.5 1.1-6.7.6l-23.2-10.2c-4.7-2.1-10.3-.2-12.4 4.5-2.1 4.7-.2 10.3 4.5 12.4l23.2 10.2c2.2.9 4.7.7 6.7-.6l13.2-8.2c1.9-1.2 3.1-3.2 3.1-5.4v-16.1c0-5.1 4.1-9.2 9.2-9.2h24.2c5.1 0 9.2 4.1 9.2 9.2v16.1c0 2.2 1.2 4.2 3.1 5.4l13.2 8.2c2 .9 4.5 1.1 6.7.6l23.2-10.2c4.7-2.1 10.3-.2 12.4-4.5z" fill="#fff" /></svg>
              Continue with MetaMask
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2" disabled>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M27.5 6.5l-9.5 7.1 1.8-4.1zM4.5 6.5l9.5 7.1-1.8-4.1zM25.6 24.2l-2.5 3.8-5.6 1.5v-4.7zM6.4 24.2l2.5 3.8 5.6 1.5v-4.7zM13.5 19.7l-5.2-1.5.7 2.1zM18.5 19.7l5.2-1.5-.7 2.1zM13.7 20.7v4.2l2.6.7v-4.9zM16.3 20.7v4.9l2.6-.7v-4.2z" fill="#8C8DF7" /><path d="M16 2l-3.2 6.5 3.2 2.4 3.2-2.4zM2 12.2l3.2 9.2 8.3-2.7-1.1-3.2zM30 12.2l-3.2 9.2-8.3-2.7 1.1-3.2z" fill="#8C8DF7" /></g></svg>
              Continue with Phantom
            </Button>
          </div>

          {/* Register button */}
          <Button
            variant="secondary"
            className="w-full mt-2"
            onClick={() => navigate({ to: "/create-account" })}
          >
            Register New Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}