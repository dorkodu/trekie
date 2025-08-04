import React, { useId } from "react"

import { Button } from "@web/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@web/components/ui/dialog"
import { Input } from "@web/components/ui/input"

export default function KickstartDialog({ children }: { children?: React.ReactNode }) {
  const id = useId()
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-12 shrink-0 items-center justify-center mb-1"
            aria-hidden="true"
          >
            <img src="/images/trekie_Icon.svg" alt="Trekie Icon" className="" />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your credentials to login to your account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Input
                id="email"
                placeholder="Email or Username"
                type="email"
                required
              />
            </div>
            <div className="*:not-first:mt-2">
              <Input
                id="password"
                placeholder="Password"
                type="password"
                required
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <a className="text-sm underline hover:no-underline" href="#">
              Forgot password?
            </a>
          </div>
          <Button type="button" className="w-full">
            Sign in
          </Button>
        </form>

        <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
          <span className="text-muted-foreground text-xs">Or</span>
        </div>

        <div></div>

        <Button variant="outline">Login with Google</Button>
      </DialogContent>
    </Dialog>
  )
}
