"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Comment, BlogPost, User } from "@/lib/types";
import { formatRelativeTime } from "@/lib/storage";
import {
  Search,
  MessageCircle,
  User as UserIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface CommentWithPost extends Comment {
  post?: BlogPost;
  user?: User;
}

export default function AllComments() {
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComments, setFilteredComments] = useState<CommentWithPost[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comments");
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();

        if (data.success) {
          // Enrich comments with post and user data
          const enrichedComments = await Promise.all(
            data.data.map(async (comment: any) => {
              // Fetch post data
              let post;
              try {
                const postResponse = await fetch(
                  `/api/posts/${comment.postId}`
                );
                if (postResponse.ok) {
                  const postData = await postResponse.json();
                  post = postData.success ? postData.data : null;
                }
              } catch (error) {
                console.error("Error fetching post:", error);
              }

              // Fetch user data
              let user;
              if (comment.authorId) {
                try {
                  const userResponse = await fetch(
                    `/api/users/${comment.authorId}`
                  );
                  if (userResponse.ok) {
                    const userData = await userResponse.json();
                    user = userData.success ? userData.data : null;
                  }
                } catch (error) {
                  console.error("Error fetching user:", error);
                }
              }

              return {
                ...comment,
                id: comment._id.toString(),
                post,
                user: user
                  ? {
                      ...user,
                      id: user._id.toString(),
                    }
                  : null,
              };
            })
          );

          setComments(enrichedComments);
        } else {
          throw new Error(data.error || "Failed to fetch comments");
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  useEffect(() => {
    const filtered = comments.filter(
      (comment) =>
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comment.authorName &&
          comment.authorName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (comment.post?.title &&
          comment.post.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredComments(filtered);
  }, [comments, searchTerm]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-10 bg-muted rounded w-full max-w-md"></div>
          <div className="space-y-4 mt-8">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-destructive p-4 rounded-md bg-destructive/10">
          <h2 className="text-xl font-medium mb-2">Error loading comments</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Comments</h1>
        <p className="text-muted-foreground mb-6">
          Browse all comments from the community
        </p>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 text-muted-foreground">
        <MessageCircle className="w-4 h-4" />
        <span>{filteredComments.length} comments found</span>
      </div>

      {filteredComments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No comments found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "No comments match your search criteria."
              : "No comments available."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentCard({ comment }: { comment: CommentWithPost }) {
  const [avatarError, setAvatarError] = useState(false);

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
            {comment.user?.avatar && !avatarError ? (
              <img
                src={comment.user.avatar}
                alt={comment.authorName}
                className="w-10 h-10 rounded-full object-cover"
                onError={handleAvatarError}
              />
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-medium text-foreground">
                {comment.user ? (
                  <Link
                    href={`/profile/${comment.user._id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {comment.authorName}
                  </Link>
                ) : (
                  comment.authorName
                )}
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

            <p className="text-foreground mb-3 whitespace-pre-wrap">
              {comment.content}
            </p>

            {comment.post && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Commented on:</span>
                <Link
                  href={`/blog/${comment.post.slug || comment.post.id}`}
                  className="font-medium text-primary hover:underline flex items-center gap-1"
                >
                  {comment.post.title}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
