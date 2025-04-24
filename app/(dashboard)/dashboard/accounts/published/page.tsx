import { getPublishedPosts } from "@/app/actions/social-accounts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ExternalLinkIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";

export default async function PublishedPostsPage() {
  const { success, posts, error } = await getPublishedPosts();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gepubliceerde Posts
          </h1>
          <p className="text-muted-foreground mt-2">
            Bekijk je gepubliceerde social media posts
          </p>
        </div>
        <Link href="/dashboard/accounts">
          <Button variant="outline">Terug naar Accounts</Button>
        </Link>
      </div>

      {!success ? (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          {error ||
            "Er is een fout opgetreden bij het ophalen van je gepubliceerde posts."}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Geen gepubliceerde posts</CardTitle>
            <CardDescription>
              Je hebt nog geen content gepubliceerd naar social media. Ga naar
              Content om te beginnen.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {post.platform === "facebook" && (
                      <FacebookIcon className="h-5 w-5 text-[#1877F2]" />
                    )}
                    {post.platform === "instagram" && (
                      <InstagramIcon className="h-5 w-5 text-[#E4405F]" />
                    )}
                    {post.platform === "twitter" && (
                      <TwitterIcon className="h-5 w-5 text-[#1DA1F2]" />
                    )}
                    {post.platform === "linkedin" && (
                      <LinkedinIcon className="h-5 w-5 text-[#0077B5]" />
                    )}
                    <CardTitle className="text-lg capitalize">
                      {post.platform}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Gepubliceerd op{" "}
                  {new Date(post.published_at).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 line-clamp-3">{post.content}</p>

                {post.image_url && (
                  <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden">
                    <img
                      src={post.image_url || "/placeholder.svg"}
                      alt="Post afbeelding"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}

                {post.external_post_url && (
                  <a
                    href={post.external_post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-primary hover:underline mt-2">
                    <ExternalLinkIcon className="h-3 w-3 mr-1" />
                    Bekijk op {post.platform}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
