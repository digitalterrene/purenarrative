"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types";
import { formatDate } from "@/lib/storage";
import { Search, Users, Calendar, FileText, Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        if (data.success) {
          // Transform the data to match your frontend expectations
          const transformedUsers = data.data.map((user: any) => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            role: user.role,
            createdAt: user.createdAt,
          }));
          setUsers(transformedUsers);
        } else {
          throw new Error(data.error || "Failed to fetch users");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const getUserPostCount = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/posts`);
      if (!response.ok) {
        console.error("Failed to fetch user posts");
        return 0;
      }
      const data = await response.json();
      return data.data?.length || 0;
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          <div className="h-10 bg-muted rounded w-full max-w-md mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-24 bg-muted rounded-full w-24 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                  <div className="h-8 bg-muted rounded w-full mt-4"></div>
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
          <h2 className="text-xl font-medium mb-2">Error loading users</h2>
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
        <h1 className="text-3xl font-bold mb-4">Community Members</h1>
        <p className="text-muted-foreground mb-6">
          Meet our community of writers and readers
        </p>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>{filteredUsers.length} members found</span>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No users found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "No users match your search criteria."
              : "No users available."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  const [postCount, setPostCount] = useState(0);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/posts`);
        if (!response.ok) {
          throw new Error("Failed to fetch user posts");
        }
        const data = await response.json();
        setPostCount(data.data?.length || 0);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPostCount();
  }, [user._id]);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <img
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name
              )}&background=random`
            }
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover mx-auto"
            onError={(e) => {
              (
                e.target as HTMLImageElement
              ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name
              )}&background=random`;
            }}
          />
          {user.role === "admin" && (
            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
              <Crown className="w-3 h-3" />
            </div>
          )}
        </div>

        <CardTitle className="text-lg">
          <Link
            href={`/profile/${user.id}`}
            className="hover:text-primary transition-colors"
          >
            {user.name}
          </Link>
        </CardTitle>

        <div className="flex justify-center gap-2">
          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
            {user.role}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {user.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {user.bio}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{loadingPosts ? "..." : postCount} posts</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              Joined {formatDate(user.createdAt).split(" ").slice(-1)[0]}
            </span>
          </div>
        </div>

        <Link
          href={`/profile/${user.id}`}
          className="block w-full text-center py-2 px-4 border border-border rounded-md hover:bg-accent transition-colors text-sm"
        >
          View Profile
        </Link>
      </CardContent>
    </Card>
  );
}
