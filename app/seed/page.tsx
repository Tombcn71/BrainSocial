"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { seedDatabase } from "../actions/seed-db"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isSeeded, setIsSeeded] = useState(false)
  const { toast } = useToast()

  const handleSeed = async () => {
    setIsSeeding(true)
    try {
      const result = await seedDatabase()

      if (result.success) {
        toast({
          title: "Database seeded",
          description: "The database has been successfully seeded with test data.",
        })
        setIsSeeded(true)
      } else {
        toast({
          title: "Error seeding database",
          description: result.error || "An error occurred while seeding the database.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error seeding database",
        description: "An error occurred while seeding the database.",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Seed Database</CardTitle>
          <CardDescription>
            This will populate the database with test data for the Dutch social media AI content platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">The following data will be created:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Test user (email: test@example.com, password: password123)</li>
            <li>Pro subscription</li>
            <li>LinkedIn and Twitter social accounts</li>
            <li>Sample content</li>
            <li>Scheduled posts</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button onClick={handleSeed} disabled={isSeeding || isSeeded} className="w-full">
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding...
              </>
            ) : isSeeded ? (
              "Database Seeded"
            ) : (
              "Seed Database"
            )}
          </Button>
          {isSeeded && (
            <div className="w-full">
              <p className="text-sm text-muted-foreground mb-2">You can now login with the following credentials:</p>
              <div className="bg-muted p-2 rounded text-sm mb-4">
                <p>Email: test@example.com</p>
                <p>Password: password123</p>
              </div>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
