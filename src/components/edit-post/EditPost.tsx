"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import TipTapEditor from "@/components/editor/TipTapEditor";
import { slugify, calculateReadingTime } from "@/lib/storage";
import { ArrowLeft, Save, Eye, X } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";

export default function EditPost({ slug }: { slug: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [originalPost, setOriginalPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    categories: [] as string[],
    tags: [] as string[],
    status: "draft" as "draft" | "published",
    featured: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const categories = [
    "poetry",
    "books",
    "technology",
    "business",
    "manuscripts",
    "lifestyle",
  ];

  useEffect(() => {
    const fetchPost = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/posts/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch post");
        }

        setOriginalPost(data.data);
        setFormData({
          title: data.data.title,
          slug: data.data.slug,
          content: data.data.content,
          excerpt: data.data.excerpt || "",
          coverImage: data.data.coverImage || "",
          categories: data.data.categories || [],
          tags: data.data.tags || [],
          status: data.data.status,
          featured: data.data.featured || false,
        });
      } catch (error) {
        toast("Error", {
          description:
            error instanceof Error ? error.message : "Failed to load post",
        });
        router.push("/dashboard");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [slug, user, router]);

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: slugify(title),
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = formData.categories.includes(categoryId);
    setFormData({
      ...formData,
      categories: isSelected
        ? formData.categories.filter((id) => id !== categoryId)
        : [...formData.categories, categoryId],
    });
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!user) {
      toast("Authentication required", {
        description: "Please sign in to edit this post.",
      });
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast("Missing required fields", {
        description: "Please provide a title and content for your post.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${originalPost.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status,
          readingTime: calculateReadingTime(formData.content),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update post");
      }

      toast(status === "published" ? "Post updated!" : "Draft saved!", {
        description:
          status === "published"
            ? "Your changes are now live and visible to readers."
            : "Your draft has been updated successfully.",
      });

      router.push(`/blog/${data.data.slug}`);
    } catch (error) {
      toast("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to update post. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please sign in to edit this post.
            </p>
            <Button onClick={() => router.push("/login")} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-8xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Loading Post...</h1>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-muted rounded w-1/2"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!originalPost) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-8xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Post Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              The post you're trying to edit doesn't exist or you don't have
              permission to edit it.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-8xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Edit Post</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and slug */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter your post title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="post-url-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of your post"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  placeholder="https://example.com/image.jpg"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Content editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content *</CardTitle>
            </CardHeader>
            <CardContent>
              <TipTapEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Start writing your post..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish options */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Post</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(featured) =>
                    setFormData({ ...formData, featured })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSubmit("draft")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={() => handleSubmit("published")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {originalPost.status === "published" ? "Update" : "Publish"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={formData.categories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label
                      htmlFor={category}
                      className="flex-1 capitalize cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={async () => {
                  if (
                    !confirm(
                      "Are you sure you want to delete this post? This action cannot be undone."
                    )
                  )
                    return;

                  try {
                    setIsLoading(true);
                    const response = await fetch(
                      `/api/posts/${originalPost.slug}`,
                      {
                        method: "DELETE",
                      }
                    );

                    if (!response.ok) {
                      throw new Error("Failed to delete post");
                    }

                    toast("Post deleted", {
                      description: "Your post has been permanently deleted.",
                    });
                    router.push("/dashboard");
                  } catch (error) {
                    toast("Error", {
                      description:
                        error instanceof Error
                          ? error.message
                          : "Failed to delete post",
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
              >
                Delete Post
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
