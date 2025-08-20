"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRelativeTime } from "@/lib/storage";
import { BlogPost, Comment } from "@/lib/types";
import {
  PlusCircle,
  FileText,
  MessageSquare,
  Bookmark,
  Eye,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState<BlogPost[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalBookmarks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        setIsLoading(true);

        // Fetch user's posts, comments, and bookmarks in parallel
        const [postsRes, commentsRes, bookmarksRes] = await Promise.all([
          fetch(`/api/posts?authorId=${user._id}`),
          fetch(`/api/comments?authorId=${user._id}`),
          fetch(`/api/bookmarks?userId=${user._id}`),
        ]);

        if (!postsRes.ok || !commentsRes.ok || !bookmarksRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [postsData, commentsData, bookmarksData] = await Promise.all([
          postsRes.json(),
          commentsRes.json(),
          bookmarksRes.json(),
        ]);

        setUserPosts(postsData.data);
        setUserComments(commentsData.data);

        // Extract posts from bookmarks
        const bookmarkedPosts = bookmarksData.data
          .map((bookmark: any) => bookmark.post)
          .filter((post: BlogPost) => post !== null);
        setBookmarkedPosts(bookmarkedPosts);
        console.log({ bookmarkedPosts });
        // Calculate stats
        const totalViews = postsData.data.reduce(
          (sum: number, post: BlogPost) => sum + (post?.viewCount || 0),
          0
        );

        setStats({
          totalPosts: postsData.data.length,
          totalViews,
          totalComments: commentsData.data.length,
          totalBookmarks: bookmarkedPosts.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-muted-foreground">
                {user.role === "admin" ? "Administrator" : "Writer"} • Joined{" "}
                {formatRelativeTime(user.createdAt as string)}
              </p>
            </div>
          </div>
          <Button asChild className="btn-hover-lift">
            <Link href="/create-post">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                Published articles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">Across all posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalComments}</div>
              <p className="text-xs text-muted-foreground">By you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookmarks}</div>
              <p className="text-xs text-muted-foreground">Saved posts</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="comments">My Comments</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {userPosts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4 text-center">
                    Start sharing your ideas with the world
                  </p>
                  <Button asChild>
                    <Link href="/create-post">Write Your First Post</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <Card key={post?._id || post?.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <Link href={`/blog/${post?.slug}`}>
                            <CardTitle className="hover:text-primary transition-colors">
                              {post?.title}
                            </CardTitle>
                          </Link>
                          <CardDescription>{post?.excerpt}</CardDescription>
                        </div>
                        <Badge
                          variant={
                            post?.status === "published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {post?.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatRelativeTime(post?.createdAt as string)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post?.viewCount || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post?.commentCount || 0} comments
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/edit-post/${post?.slug}`}>Edit</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            {userComments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No comments yet
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Start engaging with the community by commenting on posts
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userComments.map((comment) => {
                  console.log({ comment });
                  return (
                    <Card key={comment._id || comment.id}>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Comment on{" "}
                          <Link
                            href={`/blog/${comment.postSlug || comment.postId}`}
                            className="text-primary hover:underline"
                          >
                            {comment.postTitle || "a post"}
                          </Link>
                        </CardTitle>
                        <CardDescription>
                          {formatRelativeTime(comment.createdAt as string)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{comment.content}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-4">
            {bookmarkedPosts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No bookmarks yet
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Save interesting posts to read later
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookmarkedPosts.map((post) => {
                  console.log({ post });
                  return (
                    <Card key={post?._id || post?.id}>
                      <CardHeader>
                        <Link href={`/blog/${post?.slug}`}>
                          <CardTitle className="hover:text-primary transition-colors">
                            {post?.title}
                          </CardTitle>
                        </Link>
                        <CardDescription>
                          By {post?.authorName} •{" "}
                          {formatRelativeTime(post?.createdAt as string)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {post?.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post?.viewCount || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post?.commentCount || 0} comments
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
