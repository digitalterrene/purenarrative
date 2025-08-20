"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, BlogPost, Comment } from "@/lib/types";
import { formatDate, formatRelativeTime } from "@/lib/storage";
import {
  Calendar,
  Mail,
  FileText,
  MessageCircle,
  Eye,
  Crown,
  User as UserIcon,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<BlogPost[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const idInParams = params.id as string;
  const { user: loggedInUser } = useAuth();
  const id = loggedInUser?._id || idInParams;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch user data
        const userRes = await fetch(`/api/users/${id}`);
        if (!userRes.ok) {
          throw new Error("Failed to fetch user");
        }
        const userData = await userRes.json();
        setUser(userData.data);

        // Fetch user's posts and comments in parallel
        const [postsRes, commentsRes] = await Promise.all([
          fetch(`/api/posts?authorId=${id}&status=published`),
          fetch(`/api/comments?authorId=${id}`),
        ]);

        if (!postsRes.ok || !commentsRes.ok) {
          throw new Error("Failed to fetch user content");
        }

        const [postsData, commentsData] = await Promise.all([
          postsRes.json(),
          commentsRes.json(),
        ]);

        setUserPosts(postsData.data);
        setUserComments(commentsData.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">User not found</h3>
          <p className="text-muted-foreground">
            The user you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const totalViews = userPosts.reduce(
    (sum, post) => sum + (post.viewCount || 0),
    0
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-8xl">
      {/* User header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img
                src={
                  user.avatar ||
                  "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                }
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              {user.role === "admin" && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
                  <Crown className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                >
                  {user.role}
                </Badge>
              </div>

              {user.bio && (
                <p className="text-muted-foreground mb-4 max-w-2xl">
                  {user.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(user.createdAt as string)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {userPosts.length}
            </div>
            <div className="text-sm text-muted-foreground">Published Posts</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {userComments.length}
            </div>
            <div className="text-sm text-muted-foreground">Comments Made</div>
          </CardContent>
        </Card>
      </div>

      {/* Content tabs */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <Button
              variant={activeTab === "posts" ? "default" : "ghost"}
              onClick={() => setActiveTab("posts")}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Posts ({userPosts.length})
            </Button>
            <Button
              variant={activeTab === "comments" ? "default" : "ghost"}
              onClick={() => setActiveTab("comments")}
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Comments ({userComments.length})
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {activeTab === "posts" ? (
            <div className="space-y-4">
              {userPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No published posts yet.</p>
                </div>
              ) : (
                userPosts.map((post) => (
                  <Card
                    key={post._id || post.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="block group"
                          >
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-muted-foreground mb-3 line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                          </Link>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(post.createdAt as string)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.viewCount || 0} views
                            </div>
                          </div>
                        </div>

                        {post.coverImage && (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {userComments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No comments yet.</p>
                </div>
              ) : (
                userComments.map((comment) => {
                  // For comments, we'll need to fetch the associated post
                  return (
                    <Card
                      key={comment._id || comment.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {formatRelativeTime(comment.createdAt as string)}
                            </span>
                            {comment.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>

                          <p className="text-foreground whitespace-pre-wrap">
                            {comment.content}
                          </p>

                          {comment.postId && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                              <span>On:</span>
                              <Link
                                href={`/blog/${
                                  comment.postSlug || comment.postId
                                }`}
                                className="font-medium text-primary hover:underline flex items-center gap-1"
                              >
                                {comment.postTitle || "View Post"}
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
