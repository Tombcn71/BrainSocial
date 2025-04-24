import Link from "next/link"
import { BrainCircuitIcon } from "lucide-react"
import LoginForm from "./login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <BrainCircuitIcon className="h-8 w-8" />
              <span className="text-2xl font-bold">SocialAI</span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">Inloggen</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Of{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Aanmelden
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
