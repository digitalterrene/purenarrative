"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlogPost, Comment, User } from "@/lib/types";
import { formatDate, formatRelativeTime } from "@/lib/storage";
import {
  Calendar,
  Eye,
  MessageCircle,
  Clock,
  User as UserIcon,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch post data
        const postRes = await fetch(`/api/posts/${slug}`);
        if (!postRes.ok) {
          if (postRes.status === 404) {
            setError("Post not found");
          } else {
            throw new Error("Failed to fetch post");
          }
          return;
        }

        const postData = await postRes.json();
        setPost(postData.data);

        // Fetch author data
        const authorRes = await fetch(`/api/users/${postData.data.authorId}`);
        if (authorRes.ok) {
          const authorData = await authorRes.json();
          setAuthor(authorData.data);
        }

        // Fetch comments
        const commentsRes = await fetch(
          `/api/comments?postId=${postData.data._id}`
        );
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData.data);
        }

        // Check bookmark status if user is logged in
        if (user?.id) {
          const bookmarkRes = await fetch(
            `/api/bookmarks/check?userId=${user?._id}&postId=${postData.data._id}`
          );
          if (bookmarkRes.ok) {
            const bookmarkData = await bookmarkRes.json();
            setIsBookmarked(bookmarkData.isBookmarked);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load post");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug, user?.id]);

  const handleBookmark = async () => {
    if (!post || !user?._id) {
      toast.warning("Please sign in to bookmark posts");
      return;
    }

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?._id,
          postId: post._id,
          title: post?.title,
          slug: post?.slug,
          authorName: post?.authorName,
          authorAvatar: post?.authorAvatar,
          authorId: post?.authorId,
          excerpt: post?.excerpt,
          viewCount: post?.viewCount,
          commentCount: post?.commentCount,
          createdAt: post?.createdAt,
          updatedAt: post?.updatedAt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.isBookmarked);
        toast(data.isBookmarked ? "Bookmarked!" : "Bookmark removed", {
          description: data.isBookmarked
            ? "Post saved to your bookmarks"
            : "Post removed from bookmarks",
        });
      } else {
        throw new Error("Failed to update bookmark");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  const handleSubmitComment = async () => {
    if (!post || !newComment.trim() || !user?._id) {
      toast.warning("Please sign in to comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post._id || post.id,
          postTitle: post.title,
          postSlug: post.slug,
          content: newComment.trim(),
          authorId: user?._id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments([...comments, data.data]);
        setNewComment("");
        toast.success("Comment posted successfully");
      } else {
        throw new Error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <NotFound />;
  }

  if (isLoading || !post || !author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <article className="mb-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          )}

          {post.coverImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <img
                src={author.avatar || ""}
                alt={author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <Link
                  href={`/profile/${author._id}`}
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  {author.name}
                </Link>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} min read
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.viewCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {comments.length}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className="gap-2"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                {isBookmarked ? "Saved" : "Save"}
              </Button>
            </div>
          </div>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <Separator className="mb-8" />

      <section>
        <h2 className="text-2xl font-bold mb-6">
          Comments ({comments.length})
        </h2>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <Textarea
              placeholder={
                user ? "Share your thoughts..." : "Sign in to comment"
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-between items-center">
              {!user && (
                <p className="text-sm text-muted-foreground">
                  <Link href="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>{" "}
                  to comment
                </p>
              )}
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting || !user}
                className="ml-auto gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <Card key={comment._id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <UserIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-foreground">
                        {comment.authorName}
                      </span>
                      {comment.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>

                    <p className="text-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md p-8">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Post Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The blog post you're looking for doesn't exist or may have been
          removed.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.back()}>Go Back</Button>
          <Button variant="outline" asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
