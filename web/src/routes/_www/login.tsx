
import { Button } from "@web/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@web/components/ui/card"
import { Input } from "@web/components/ui/input"
import { Label } from "@web/components/ui/label"

import { USERNAME_REGEX } from "@sdk/core"
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from "@web/lib/auth/AuthProvider"
import { FieldInfo } from "@web/lib/forms"
import z from "zod"

export const Route = createFileRoute('/_www/login')({ component: Page })

interface Credentials {
  loginName: string
  password: string
}

const defaultCredentials: Credentials = {
  loginName: '',
  password: ''
}

function Page() {
  const { login, socialLogin, loading, error, clearError } = useAuth()
  const navigate = useNavigate()

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

          <LoginForm />

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
            Create Account
          </Button>
        </CardContent>
      </Card>
    </div >
  )
}

const safecheckEmail = (x: string) => z.email().trim().safeParse(x)
const safecheckUsername = (x: string) => z.string().trim().regex(USERNAME_REGEX).safeParse(x)

function LoginForm() {
  const { login, socialLogin, loading, error, clearError } = useAuth()



  const form = useForm({
    defaultValues: defaultCredentials,
    validators: {
      onBlur: ({ value, formApi }) => {
        if (!value.loginName)
          return 'Your email or username is required.'

        if (!value.password)
          return 'Password is required.'

        if (safecheckEmail(value.loginName).success) {
          return undefined
        } else if (safecheckUsername(value.loginName).success) {
          return undefined
        } else {
          return 'Please enter a valid email or username.'
        }
      },
      onSubmit: ({ value, formApi }) => {
        if (!value.loginName || !value.password) {
          return 'Both email/username and password are required.'
        }

        if (safecheckEmail(value.loginName).success || safecheckUsername(value.loginName).success) {
          return undefined
        } else {
          return 'Please enter a valid email or username.'
        }
      }
    },
    onSubmit: async ({ value, formApi }) => {
      // Do something with form data
      alert(JSON.stringify(value, null, 2))

      // Validate loginName as email or username
    }
  })

  const navigate = useNavigate()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6">

      <form.Field
        name="loginName"
        validators={{
          onChange: ({ value }) =>
            !value
              ? 'A email or username is required'
              : undefined,
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async ({ value }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            return (
              value.includes('error') && 'No "error" allowed in email or username'
            )
          },
        }}
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>Email or Username</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}

                placeholder="you@example.com"
                type="email"
                required
                className="mt-1"
                disabled={loading}
              />
              <FieldInfo field={field} />
            </>
          )
        }}
      />

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) =>
            !value ? 'Password is required' : undefined,
        }}
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>Password</Label>
              <Input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-1"
                disabled={loading}
              />
              <FieldInfo field={field} />
            </>
          )
        }}
      />

      <form.Subscribe
        selector={(state) => [state.errorMap]}
        children={([errorMap]) => errorMap.onSubmit ? (
          <div>
            <em>There was an error on the form: {errorMap.onSubmit}</em>
          </div>
        ) : null
        }
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  )

}