"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  MessageCircle,
  Clock,
  BookmarkPlus,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogPost, Category, User } from "@/lib/types";
import { formatRelativeTime } from "@/lib/storage";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

interface BlogFilters {
  categories: string[];
  tags: string[];
  search: string;
}

interface SortOptions {
  field: "createdAt" | "viewCount" | "title";
  direction: "asc" | "desc";
}

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<BlogFilters>({
    categories: [],
    tags: [],
    search: "",
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "createdAt",
    direction: "desc",
  });
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch posts, categories, and users in parallel
        const [postsRes, categoriesRes, usersRes] = await Promise.all([
          fetch("/api/posts?status=published"),
          fetch("/api/categories"),
          fetch("/api/users"),
        ]);

        if (!postsRes.ok || !categoriesRes.ok || !usersRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [postsData, categoriesData, usersData] = await Promise.all([
          postsRes.json(),
          categoriesRes.json(),
          usersRes.json(),
        ]);

        setPosts(postsData.data);
        setCategories(categoriesData.data);
        setUsers(usersData.data);

        // Fetch bookmarks if user is logged in
        if (user?.id) {
          const bookmarksRes = await fetch(
            `/api/bookmarks?userId=${user?._id}`
          );
          if (bookmarksRes.ok) {
            const bookmarksData = await bookmarksRes.json();
            setBookmarks(bookmarksData.data.map((b: any) => b.postId));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?._id, user?.id]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...posts];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((post) =>
        post.categories?.some((categoryId) =>
          filters.categories.includes(categoryId)
        )
      );
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((post) =>
        post.tags?.some((tag) => filters.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortOptions.field];
      const bValue = b[sortOptions.field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOptions.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOptions.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    setFilteredPosts(filtered);
  }, [posts, filters, sortOptions]);

  const getAuthor = (authorId: string): User | undefined => {
    return users.find((user) => user._id === authorId);
  };

  const getCategory = (categoryId: string): Category | undefined => {
    return categories.find((category) => category._id === categoryId);
  };

  const getCommentCount = async (postId: string): Promise<number> => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        return data.total || 0;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return 0;
    }
  };

  const toggleBookmark = async (postId: string) => {
    if (!user?._id) {
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
          postId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks);
        toast.success(data.message);
      } else {
        throw new Error("Failed to update bookmark");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  const handleSortChange = (value: string) => {
    const [fieldStr, direction] = value.split("-");
    const field = fieldStr as SortOptions["field"];
    setSortOptions({ field, direction: direction as "asc" | "desc" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border/40 bg-gradient-to-r from-background to-muted/30">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Welcome to Pure Narrative
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A modern, minimalistic blog platform where ideas come to life.
            Discover stories, thoughts, and insights from our community of
            writers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="btn-hover-lift">
              <Link
                href="/create-post"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Start Writing
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="btn-hover-lift"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="border-b border-border/40 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10 focus-ring"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </div>

              {/* Category Filter */}
              <Select
                value={filters.categories[0] || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    categories: value === "all" ? [] : [value],
                  }))
                }
              >
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <Select
              value={`${sortOptions.field}-${sortOptions.direction}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="viewCount-desc">Most Viewed</SelectItem>
                <SelectItem value="title-asc">Title A-Z</SelectItem>
                <SelectItem value="title-desc">Title Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 py-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-4">No posts found</h3>
            <p className="text-muted-foreground mb-8">
              {posts.length === 0
                ? "Be the first to create a post!"
                : "Try adjusting your filters or search terms."}
            </p>
            <Button asChild>
              <Link href="/register">Write Your First Post</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const author = getAuthor(post.authorId);
              const isBookmarked = bookmarks.includes(
                post._id || post.id || ""
              );

              return (
                <Card key={post._id || post.id} className="card-hover group">
                  {post.coverImage && (
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}

                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.categories?.map((categoryId) => {
                          const category = getCategory(categoryId);
                          return category ? (
                            <Badge key={category._id} variant="secondary">
                              {category.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleBookmark(post._id || post.id || "")
                        }
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {isBookmarked ? (
                          <Bookmark className="h-4 w-4 fill-current" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="block">
                      <h3 className="text-xl font-semibold line-clamp-2 hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>

                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags && post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={author?.avatar} alt={author?.name} />
                        <AvatarFallback>
                          {author?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {author?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(post.createdAt as string)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.viewCount || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{post.commentCount || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readingTime || 0}m</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
