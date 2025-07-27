import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_www/create-account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignupForm />
}

import { Button } from "@web/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, } from "@web/components/ui/card";
import { Checkbox } from "@web/components/ui/checkbox";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";

const signupSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.boolean().refine(val => val === true, "You must agree to the terms and privacy policy")
});

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      displayName: '',
      username: '',
      email: '',
      password: '',
      terms: false
    },
    onSubmit: async ({ value }) => {
      // Validate the form data
      const validation = signupSchema.safeParse(value);

      if (!validation.success) {
        console.error('Validation failed:', validation.error);
        return;
      }

      // Handle form submission here
      console.log('Form submitted:', validation.data);
      // TODO: Implement actual signup logic
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg p-0 bg-background">
          <CardHeader className="flex flex-col items-center space-y-1.5 pb-4 pt-6">
            <div className="space-y-0.5 flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-foreground">
                Create Account
              </h2>
              <p className="text-muted-foreground">
                Welcome, it's always a good time to start anew!
              </p>
            </div>
          </CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <CardContent className="space-y-6 px-8">
              <form.Field
                name="displayName"
                validators={{
                  onChange: ({ value }) => {
                    const result = z.string().min(2, "Display name must be at least 2 characters").safeParse(value);
                    return result.success ? undefined : result.error.issues[0].message;
                  }
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Your Name</Label>
                    <Input
                      id="displayName"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="username"
                validators={{
                  onChange: ({ value }) => {
                    const result = z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores").safeParse(value);
                    return result.success ? undefined : result.error.issues[0].message;
                  }
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = z.string().email("Please enter a valid email address").safeParse(value);
                    return result.success ? undefined : result.error.issues[0].message;
                  }
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    const result = z.string().min(8, "Password must be at least 8 characters").safeParse(value);
                    return result.success ? undefined : result.error.issues[0].message;
                  }
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="terms"
                validators={{
                  onChange: ({ value }) => {
                    const result = z.boolean().refine(val => val === true, "You must agree to the terms and privacy policy").safeParse(value);
                    return result.success ? undefined : result.error.issues[0].message;
                  }
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={field.state.value}
                        onCheckedChange={(checked) => field.handleChange(checked === true)}
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the{" "}
                        <Link to="/legal/terms-of-service" className="text-primary hover:underline">
                          Terms
                        </Link>{" "}
                        and{" "}
                        <Link to="/legal/privacy-policy" className="text-primary hover:underline">
                          Privacy
                        </Link>
                      </label>
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                )}
              </form.Subscribe>
            </CardContent>
          </form>
          <CardFooter className="flex justify-center border-t !py-4">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
