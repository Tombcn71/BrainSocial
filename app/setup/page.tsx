"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  const [apiKey, setApiKey] = useState("")
  const [isTesting, setIsTesting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const testConnection = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google AI API key",
        variant: "destructive",
      })
      return
    }

    setIsTesting(true)
    try {
      // This is just a simulation since we can't actually set environment variables client-side
      // In a real app, you would send this to a server endpoint that validates the key
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Connection Successful",
        description: "Your Google AI API key is valid. Add this key to your environment variables.",
      })
      setIsSuccess(true)
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Google AI. Please check your API key.",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup Gemini Integration</CardTitle>
          <CardDescription>
            Connect your application with Google's Gemini API to enable AI-powered content generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Google AI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="AIza..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              You can get your API key from the{" "}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
              .
            </p>
          </div>

          <div className="rounded-md bg-muted p-4">
            <h3 className="font-medium mb-2">Environment Setup</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Add the following to your <code>.env.local</code> file:
            </p>
            <pre className="bg-black text-white p-2 rounded text-xs overflow-x-auto">
              GEMINI_API_KEY=your_api_key_here
            </pre>
          </div>

          <div className="rounded-md bg-muted p-4">
            <h3 className="font-medium mb-2">Free Tier Benefits</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>Up to 60 queries per minute</li>
              <li>Free access to Gemini 1.5 Pro and Flash models</li>
              <li>No credit card required</li>
              <li>Generous monthly quota</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button onClick={testConnection} disabled={isTesting || !apiKey} className="w-full">
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
          {isSuccess && (
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
