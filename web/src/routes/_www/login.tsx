

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { LoginForm } from '@web/components/forms/login-form'
import { Button } from '@web/components/ui/button'
import { useAuth } from "@web/lib/auth/AuthProvider"

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
    <main className="flex h-screen items-center justify-center">
      <div className="w-full max-w-xs gap-6">

        <div className="flex flex-col items-center gap-2 text-center mb-6 -mt-25">
          <h1 className="text-2xl font-bold">Welcome to Trekie!</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Continue where you left, or start anew.
          </p>
        </div>

        <LoginForm />

        <div className="flex items-center gap-3 my-4 before:bg-border after:bg-border before:h-px before:flex-1 after:h-px after:flex-1 ">
          <span className="text-muted-foreground text-xs">OR</span>
        </div>

        <div className="flex flex-wrap gap-2">

          <Button className="w-full font-bold" variant="light" aria-label="Create Account" asChild onClick={() => { }}>
            <Link to="/create-account">CREATE YOUR ACCOUNT</Link>
          </Button>

          <Button
            className="w-full after:flex-1 font-medium"
            variant="outline"
            aria-label="Continue with Google"
          >
            <span className="pointer-events-none me-2 flex-1">
              <img className="size-[18px]"
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg" alt="" />
            </span>
            <span>CONTINUE WITH GOOGLE</span>
          </Button>

        </div>

        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our <br /> <Link to="/legal/terms-of-service" className="text-primary underline">Terms of Service</Link> and <Link to="/legal/privacy-policy" className="text-primary underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </main>
  )
}
