export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: "admin" | "user";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string | null | undefined;
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: string;
}

export interface BlogPost {
  commentCount: number;
  _id: string;
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  categories: string[];
  tags: string[];
  status: "draft" | "published";
  viewCount: number;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  postSlug: string;
  _id: string;
  id: string;
  postId: string;
  postTitle: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}
