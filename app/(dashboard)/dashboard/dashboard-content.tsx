"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  CalendarIcon,
  RocketIcon,
  BarChart3Icon,
  SparklesIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { dict } from "@/lib/dictionary";

export default function DashboardContent() {
  // Mock data for recent content
  const recentContent = [
    {
      id: "1",
      title: "Nieuwe productlancering",
      platform: "LinkedIn",
      date: "2023-04-15",
    },
    {
      id: "2",
      title: "Zomercampagne aankondiging",
      platform: "Instagram",
      date: "2023-04-12",
    },
    {
      id: "3",
      title: "Klantcase studie",
      platform: "Twitter",
      date: "2023-04-10",
    },
  ];

  // Mock data for scheduled posts
  const scheduledPosts = [
    {
      id: "1",
      title: "Webinar uitnodiging",
      platform: "LinkedIn",
      scheduledFor: "2023-04-20T14:00:00",
    },
    {
      id: "2",
      title: "Nieuwe blog post",
      platform: "Twitter",
      scheduledFor: "2023-04-18T10:00:00",
    },
  ];

  return (
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#8A4FFF]">
            {dict.dashboard.welcome}, Tom
          </h1>
          <p className="text-muted-foreground">
            Laten we vandaag wat geweldige content maken!
          </p>
        </div>
        <Link href="/dashboard/content">
          <Button className="bg-gradient-to-r from-[#8A4FFF] to-[#FF4F8A] text-white rounded-full hover:shadow-md transition-all">
            <PlusIcon className="mr-2 h-4 w-4" />
            {dict.dashboard.createContent}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#8A4FFF]/20 hover:shadow-md transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totale berichten
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center">
              <RocketIcon className="h-4 w-4 text-[#8A4FFF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center mt-1">
              <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-500">
                +10% vergeleken met vorige maand
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-400/20 hover:shadow-md transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Geplande berichten
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-400/10 flex items-center justify-center">
              <CalendarIcon className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground mt-1">
              Voor de komende 7 dagen
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-400/20 hover:shadow-md transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-400/10 flex items-center justify-center">
              <BarChart3Icon className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Vergeleken met vorige maand
            </p>
          </CardContent>
        </Card>

        <Card className="border-pink-400/20 hover:shadow-md transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Generaties</CardTitle>
            <div className="h-8 w-8 rounded-full bg-pink-400/10 flex items-center justify-center">
              <SparklesIcon className="h-4 w-4 text-pink-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18/20</div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
              <div
                className="bg-gradient-to-r from-[#8A4FFF] to-pink-400 h-1.5 rounded-full"
                style={{ width: "90%" }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dagelijkse limiet
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4 border-[#8A4FFF]/10 hover:shadow-md transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{dict.dashboard.recentContent}</CardTitle>
                <CardDescription>Je recent gemaakte content</CardDescription>
              </div>
              <div className="h-8 w-8 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center">
                <ZapIcon className="h-4 w-4 text-[#8A4FFF]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContent.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {content.platform} •{" "}
                      {new Date(content.date).toLocaleDateString("nl-NL")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full hover:bg-[#8A4FFF]/10 hover:text-[#8A4FFF] border-[#8A4FFF]/20">
                      Bewerken
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full hover:bg-blue-400/10 hover:text-blue-400 border-blue-400/20">
                      Inplannen
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-blue-400/10 hover:shadow-md transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{dict.dashboard.scheduledPosts}</CardTitle>
                <CardDescription>Je ingeplande berichten</CardDescription>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-400/10 flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.platform} •{" "}
                      {new Date(post.scheduledFor).toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full hover:bg-blue-400/10 hover:text-blue-400 border-blue-400/20">
                    Bekijken
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/calendar">
                <Button
                  variant="outline"
                  className="w-full rounded-full hover:bg-blue-400/10 hover:text-blue-400 border-blue-400/20">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Naar kalender
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
