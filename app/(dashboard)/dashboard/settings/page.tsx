import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileSettings from "./profile-settings"
import SubscriptionSettings from "./subscription-settings"
import SocialAccountsSettings from "./social-accounts-settings"
import AISettings from "./ai-settings"

export default function SettingsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account instellingen</h1>
        <p className="text-muted-foreground mt-2">Beheer je account instellingen en voorkeuren.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profiel</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          <TabsTrigger value="social-accounts">Social media accounts</TabsTrigger>
          <TabsTrigger value="ai-settings">AI Instellingen</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="subscription">
          <SubscriptionSettings />
        </TabsContent>
        <TabsContent value="social-accounts">
          <SocialAccountsSettings />
        </TabsContent>
        <TabsContent value="ai-settings">
          <AISettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
