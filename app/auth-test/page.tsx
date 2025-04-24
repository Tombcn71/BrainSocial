"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function AuthTestPage() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">NextAuth Test Page</h1>

      <div className="p-4 border rounded-md mb-4">
        <h2 className="text-xl font-semibold mb-2">Session Status: {status}</h2>

        {isLoading ? (
          <p>Loading session...</p>
        ) : session ? (
          <div>
            <p className="mb-2">Signed in as:</p>
            <pre className="bg-gray-100 p-2 rounded overflow-auto mb-4">{JSON.stringify(session, null, 2)}</pre>
            <Button onClick={() => signOut()}>Sign Out</Button>
          </div>
        ) : (
          <div>
            <p className="mb-4">Not signed in</p>
            <Button onClick={() => signIn()}>Sign In</Button>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        <p>This page tests if NextAuth.js is properly configured.</p>
        <p>If you see your session data above, NextAuth is working correctly.</p>
      </div>
    </div>
  )
}
