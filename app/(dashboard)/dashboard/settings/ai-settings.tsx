"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function AISettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [defaultModel, setDefaultModel] = useState("gemini-1.5-pro")
  const [temperature, setTemperature] = useState(0.7)
  const [enhanceContent, setEnhanceContent] = useState(true)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // This would be replaced with actual save logic
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Instellingen opgeslagen",
        description: "Je AI instellingen zijn succesvol opgeslagen.",
      })
    } catch (error) {
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van je instellingen.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Instellingen</CardTitle>
        <CardDescription>Configureer de AI-instellingen voor contentgeneratie.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="model">Standaard AI Model</Label>
          <Select value={defaultModel} onValueChange={setDefaultModel}>
            <SelectTrigger>
              <SelectValue placeholder="Selecteer model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Aanbevolen)</SelectItem>
              <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Sneller)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Gemini 1.5 Pro biedt de beste kwaliteit. Gemini 1.5 Flash is sneller en efficiënter voor korte content.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="temperature">Creativiteit</Label>
            <span className="text-sm text-muted-foreground">{Math.round(temperature * 100)}%</span>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={1}
            step={0.1}
            value={[temperature]}
            onValueChange={(value) => setTemperature(value[0])}
          />
          <p className="text-xs text-muted-foreground">
            Hogere waarden maken de content creatiever maar mogelijk minder nauwkeurig. Lagere waarden maken de content
            consistenter.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enhance-content">Content verbetering</Label>
            <p className="text-xs text-muted-foreground">
              Automatisch content verbeteren met SEO-optimalisatie en engagement-verhogende elementen.
            </p>
          </div>
          <Switch id="enhance-content" checked={enhanceContent} onCheckedChange={setEnhanceContent} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Opslaan...
            </>
          ) : (
            "Instellingen opslaan"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
