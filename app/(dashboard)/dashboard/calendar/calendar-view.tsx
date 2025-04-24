"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  Loader2,
  FilterIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { dict } from "@/lib/dictionary";
import { getProjects } from "@/app/actions/projects";
import { getCampaigns } from "@/app/actions/campaigns";
import {
  getScheduledPosts,
  getUserContent,
  scheduleContent,
} from "@/app/actions/content";

interface CalendarViewProps {
  initialContentId?: string;
  initialProjectId?: string;
  initialCampaignId?: string;
}

export default function CalendarView({
  initialContentId,
  initialProjectId,
  initialCampaignId,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [userContent, setUserContent] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterProjectId, setFilterProjectId] = useState(
    initialProjectId || ""
  );
  const [filterCampaignId, setFilterCampaignId] = useState(
    initialCampaignId || ""
  );
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Gebruik de initiële waarden die via props worden doorgegeven
    if (initialProjectId) {
      setFilterProjectId(initialProjectId);
      loadCampaigns(initialProjectId);
    }

    if (initialCampaignId) {
      setFilterCampaignId(initialCampaignId);
    }

    loadScheduledPosts(
      initialProjectId || undefined,
      initialCampaignId || undefined
    );
    loadUserContent(
      initialProjectId || undefined,
      initialCampaignId || undefined
    );
    loadProjects();

    if (initialContentId) {
      setSelectedContent(initialContentId);
      setIsAddDialogOpen(true);
    }
  }, [initialContentId, initialProjectId, initialCampaignId]);

  const loadScheduledPosts = async (
    projectId?: string,
    campaignId?: string
  ) => {
    setIsLoading(true);
    try {
      const result = await getScheduledPosts(100, projectId, campaignId);
      if (result.success) {
        // Zorg ervoor dat we altijd een array hebben, zelfs als result.scheduledPosts undefined is
        setScheduledPosts(
          Array.isArray(result.scheduledPosts) ? result.scheduledPosts : []
        );
      } else {
        // Als er een fout is, zet dan een lege array
        setScheduledPosts([]);
      }
    } catch (error) {
      console.error("Error loading scheduled posts:", error);
      // Bij een fout zetten we ook een lege array
      setScheduledPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserContent = async (projectId?: string, campaignId?: string) => {
    try {
      const result = await getUserContent(100, projectId, campaignId);
      if (result.success) {
        // Ensure we always set an array, even if result.content is undefined
        setUserContent(Array.isArray(result.content) ? result.content : []);
      } else {
        setUserContent([]);
      }
    } catch (error) {
      console.error("Error loading user content:", error);
      setUserContent([]);
    }
  };

  const loadProjects = async () => {
    try {
      const result = await getProjects();
      if (result.success) {
        // Zorg ervoor dat we altijd een array hebben
        setProjects(result.projects || []);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjects([]);
    }
  };

  const loadCampaigns = async (projectId: string) => {
    if (!projectId) {
      setCampaigns([]);
      return;
    }

    try {
      const result = await getCampaigns(projectId);
      if (result.success) {
        // Ensure we always set an array, even if result.campaigns is undefined
        setCampaigns(Array.isArray(result.campaigns) ? result.campaigns : []);
      } else {
        setCampaigns([]);
      }
    } catch (error) {
      console.error("Error loading campaigns:", error);
      setCampaigns([]);
    }
  };

  const handleFilterProjectChange = (value: string) => {
    setFilterProjectId(value);
    setFilterCampaignId("");
    loadCampaigns(value);
  };

  const applyFilters = () => {
    loadScheduledPosts(
      filterProjectId || undefined,
      filterCampaignId || undefined
    );
    loadUserContent(
      filterProjectId || undefined,
      filterCampaignId || undefined
    );
    setIsFilterDialogOpen(false);

    // Update URL with filter params
    const params = new URLSearchParams();
    if (filterProjectId) params.set("projectId", filterProjectId);
    if (filterCampaignId) params.set("campaignId", filterCampaignId);

    router.push(`/dashboard/calendar?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilterProjectId("");
    setFilterCampaignId("");
    loadScheduledPosts();
    loadUserContent();
    setIsFilterDialogOpen(false);
    router.push("/dashboard/calendar");
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <LinkedinIcon className="h-4 w-4" />;
      case "twitter":
        return <TwitterIcon className="h-4 w-4" />;
      case "instagram":
        return <InstagramIcon className="h-4 w-4" />;
      case "facebook":
        return <FacebookIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSchedulePost = async () => {
    if (!selectedContent) {
      toast({
        title: "Content is verplicht",
        description: "Selecteer content om in te plannen.",
        variant: "destructive",
      });
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      toast({
        title: "Datum en tijd zijn verplicht",
        description: "Vul een datum en tijd in om in te plannen.",
        variant: "destructive",
      });
      return;
    }

    setIsScheduling(true);
    try {
      const content = userContent.find((c) => c.id === selectedContent);
      const result = await scheduleContent(
        selectedContent,
        `${scheduledDate}T${scheduledTime}:00`,
        content?.campaign_id
      );

      if (result.success) {
        toast({
          title: "Post ingepland",
          description: "Je post is succesvol ingepland.",
        });
        setIsAddDialogOpen(false);
        loadScheduledPosts(
          filterProjectId || undefined,
          filterCampaignId || undefined
        );
      } else {
        toast({
          title: "Fout bij inplannen",
          description:
            "Er is een fout opgetreden bij het inplannen van je post.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout bij inplannen",
        description: "Er is een fout opgetreden bij het inplannen van je post.",
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const handleViewPost = (post: any) => {
    setSelectedPost(post);
    setIsViewDialogOpen(true);
  };

  const handlePublishPost = async () => {
    if (!selectedPost) return;

    setIsPublishing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setScheduledPosts(
        scheduledPosts.map((post) =>
          post.id === selectedPost.id ? { ...post, status: "published" } : post
        )
      );

      toast({
        title: "Post gepubliceerd",
        description: "Je post is succesvol gepubliceerd.",
      });
      setIsViewDialogOpen(false);
    } catch (error) {
      toast({
        title: "Fout bij publiceren",
        description:
          "Er is een fout opgetreden bij het publiceren van je post.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek =
      firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // Monday as first day

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get posts for a specific day
  const getPostsForDay = (date: Date) => {
    if (!date) return [];

    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduled_for);
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Format date for display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
  };

  // Set default date and time for scheduling
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateStr = tomorrow.toISOString().split("T")[0];
    const timeStr = "09:00";

    setScheduledDate(dateStr);
    setScheduledTime(timeStr);
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="month">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <TabsList>
              <TabsTrigger value="month">{dict.calendar.month}</TabsTrigger>
              <TabsTrigger value="week">{dict.calendar.week}</TabsTrigger>
              <TabsTrigger value="day">{dict.calendar.day}</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleToday}>
                {dict.calendar.today}
              </Button>
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Dialog
                open={isFilterDialogOpen}
                onOpenChange={setIsFilterDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FilterIcon className="h-4 w-4 mr-2" />
                    Filteren
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Kalender filteren</DialogTitle>
                    <DialogDescription>
                      Filter de kalender op project en campagne
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="filterProject">Project</Label>
                      <Select
                        value={filterProjectId}
                        onValueChange={handleFilterProjectChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Alle projecten" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle projecten</SelectItem>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="filterCampaign">Campagne</Label>
                      <Select
                        value={filterCampaignId}
                        onValueChange={setFilterCampaignId}
                        disabled={!filterProjectId}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              filterProjectId
                                ? "Alle campagnes"
                                : "Selecteer eerst een project"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle campagnes</SelectItem>
                          {campaigns.map((campaign) => (
                            <SelectItem key={campaign.id} value={campaign.id}>
                              {campaign.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={clearFilters}>
                      Filters wissen
                    </Button>
                    <Button onClick={applyFilters}>Toepassen</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    {dict.calendar.addEvent}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nieuwe post inplannen</DialogTitle>
                    <DialogDescription>
                      Plan een nieuwe post in voor publicatie.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="content">Content</Label>
                      <Select
                        value={selectedContent}
                        onValueChange={setSelectedContent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer content" />
                        </SelectTrigger>
                        <SelectContent>
                          {userContent.map((content) => (
                            <SelectItem key={content.id} value={content.id}>
                              <div className="flex flex-col">
                                <span>
                                  {content.title ||
                                    content.content.substring(0, 30) + "..."}
                                </span>
                                {content.project_name && (
                                  <span className="text-xs text-muted-foreground">
                                    {content.project_name}{" "}
                                    {content.campaign_name
                                      ? `/ ${content.campaign_name}`
                                      : ""}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Datum</Label>
                        <Input
                          id="date"
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Tijd</Label>
                        <Input
                          id="time"
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}>
                      Annuleren
                    </Button>
                    <Button
                      onClick={handleSchedulePost}
                      disabled={isScheduling}>
                      {isScheduling ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Inplannen...
                        </>
                      ) : (
                        "Inplannen"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="month" className="mt-0">
            <div className="text-xl font-semibold mb-4">
              {formatMonthYear(currentDate)}
              {(filterProjectId || filterCampaignId) && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  {filterProjectId &&
                    projects.find((p) => p.id === filterProjectId)?.name}
                  {filterCampaignId &&
                    campaigns.find((c) => c.id === filterCampaignId) &&
                    ` / ${
                      campaigns.find((c) => c.id === filterCampaignId)?.name
                    }`}
                </span>
              )}
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
                  <div
                    key={day}
                    className="h-8 flex items-center justify-center font-medium">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[100px] border rounded-md p-1 ${
                      day &&
                      day.getDate() === new Date().getDate() &&
                      day.getMonth() === new Date().getMonth() &&
                      day.getFullYear() === new Date().getFullYear()
                        ? "bg-muted"
                        : ""
                    }`}>
                    {day && (
                      <>
                        <div className="text-sm font-medium mb-1">
                          {day.getDate()}
                        </div>
                        <div className="space-y-1">
                          {getPostsForDay(day).map((post) => (
                            <button
                              key={post.id}
                              onClick={() => handleViewPost(post)}
                              className="w-full text-left text-xs p-1 rounded bg-primary/10 hover:bg-primary/20 flex items-center gap-1 truncate">
                              {getPlatformIcon(post.platform)}
                              <span className="truncate">
                                {post.title ||
                                  post.content.substring(0, 20) + "..."}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="week">
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">
                Week weergave komt binnenkort.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="day">
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">
                Dag weergave komt binnenkort.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          {selectedPost && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedPost.title || "Geplande post"}
                </DialogTitle>
                <DialogDescription>
                  Gepland voor{" "}
                  {new Date(selectedPost.scheduled_for).toLocaleDateString(
                    "nl-NL",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}{" "}
                  om{" "}
                  {new Date(selectedPost.scheduled_for).toLocaleTimeString(
                    "nl-NL",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {getPlatformIcon(selectedPost.platform)}
                    <span className="capitalize">{selectedPost.platform}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ClockIcon className="h-4 w-4" />
                    <span>
                      {new Date(selectedPost.scheduled_for).toLocaleTimeString(
                        "nl-NL",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>
                {(selectedPost.project_name || selectedPost.campaign_name) && (
                  <div className="mb-4 text-sm">
                    <span className="font-medium">Project/Campagne: </span>
                    <span className="text-muted-foreground">
                      {selectedPost.project_name || ""}
                      {selectedPost.campaign_name &&
                        ` / ${selectedPost.campaign_name}`}
                    </span>
                  </div>
                )}
                <div className="rounded-md border p-4 whitespace-pre-wrap">
                  {selectedPost.content}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}>
                  Sluiten
                </Button>
                {selectedPost.status === "scheduled" && (
                  <Button onClick={handlePublishPost} disabled={isPublishing}>
                    {isPublishing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publiceren...
                      </>
                    ) : (
                      "Nu publiceren"
                    )}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
}
