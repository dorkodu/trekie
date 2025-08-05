import { USERNAME_REGEX } from "@sdk/core"
import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@web/lib/auth/AuthProvider"
import { FieldInfo } from "@web/lib/forms"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"


interface Credentials {
  loginName: string
  password: string
}

const defaultCredentials: Credentials = {
  loginName: '',
  password: ''
}

export const safecheckEmail = (x: string) => z.email().trim().safeParse(x)
export const safecheckUsername = (x: string) => z.string().trim().regex(USERNAME_REGEX).safeParse(x)

export function LoginForm() {
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
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}

                placeholder="Email or Username"
                type="text"
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
                placeholder="∗∗∗∗∗∗"
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