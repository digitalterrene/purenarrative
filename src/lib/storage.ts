// storage.ts
import {
  User,
  BlogPost,
  Comment,
  Category,
  Bookmark,
  ContactMessage,
} from "./types";

// Storage keys
const STORAGE_KEYS = {
  USERS: "blog_users",
  POSTS: "blog_posts",
  COMMENTS: "blog_comments",
  CATEGORIES: "blog_categories",
  BOOKMARKS: "blog_bookmarks",
  CONTACT_MESSAGES: "blog_contact_messages",
  CURRENT_USER: "blog_current_user",
} as const;

// Generic storage utilities
interface StorageManager<T> {
  getAll(): T[];
  save(items: T[]): void;
  add(item: Omit<T, "id"> & Partial<Pick<T, "id">>): T;
  update(id: string, updateFn: (item: T) => T): void;
  delete(id: string): void;
  getById(id: string): T | undefined;
  clear(): void;
}

function createStorageManager<T extends { id: string }>(
  key: string
): StorageManager<T> {
  return {
    getAll(): T[] {
      if (typeof window === "undefined") return [];
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return [];
      }
    },

    save(items: T[]): void {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(key, JSON.stringify(items));
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    },

    add(item: Omit<T, "id"> & Partial<Pick<T, "id">>): T {
      const items = this.getAll();
      const newItem = {
        ...item,
        id: item.id || generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as T;
      items.push(newItem);
      this.save(items);
      return newItem;
    },

    update(id: string, updateFn: (item: T) => T): void {
      const items = this.getAll();
      const index = items.findIndex((item) => item.id === id);
      if (index !== -1) {
        items[index] = updateFn({ ...items[index] });
        this.save(items);
      }
    },

    delete(id: string): void {
      const items = this.getAll();
      const filtered = items.filter((item) => item.id !== id);
      this.save(filtered);
    },

    getById(id: string): T | undefined {
      return this.getAll().find((item) => item.id === id);
    },

    clear(): void {
      if (typeof window === "undefined") return;
      localStorage.removeItem(key);
    },
  };
}

// Specific storage managers
export const userStorage = {
  ...createStorageManager<User>(STORAGE_KEYS.USERS),

  getByEmail(email: string): User | undefined {
    return this.getAll().find((user) => user.email === email);
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error reading current user:", error);
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (typeof window === "undefined") return;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (error) {
      console.error("Error setting current user:", error);
    }
  },

  clearCurrentUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
};

export const postStorage = {
  ...createStorageManager<BlogPost>(STORAGE_KEYS.POSTS),

  getBySlug(slug: string): BlogPost | undefined {
    return this.getAll().find((post) => post.slug === slug);
  },
  create(post: Omit<BlogPost, "id"> & Partial<Pick<BlogPost, "id">>): BlogPost {
    return this.add(post);
  },
  getByAuthor(authorId: string): BlogPost[] {
    return this.getAll().filter((post) => post.authorId === authorId);
  },

  getPublished(): BlogPost[] {
    return this.getAll().filter((post) => post.status === "published");
  },

  incrementViewCount(id: string): void {
    this.update(id, (post) => ({
      ...post,
      viewCount: (post.viewCount || 0) + 1,
    }));
  },

  search(query: string): BlogPost[] {
    const lowerQuery = query.toLowerCase();
    return this.getPublished().filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt?.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },

  getByCategory(categorySlug: string): BlogPost[] {
    return this.getPublished().filter((post) =>
      post.categories?.includes(categorySlug)
    );
  },

  getByTag(tag: string): BlogPost[] {
    return this.getPublished().filter((post) => post.tags?.includes(tag));
  },
};

export const commentStorage = {
  ...createStorageManager<Comment>(STORAGE_KEYS.COMMENTS),

  getByPostId(postId: string): Comment[] {
    return this.getAll()
      .filter((comment) => comment.postId === postId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getByAuthorId(authorId: string): Comment[] {
    return this.getAll()
      .filter((comment) => comment.authorId === authorId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },
};

export const categoryStorage = createStorageManager<Category>(
  STORAGE_KEYS.CATEGORIES
);
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
export const bookmarkStorage = {
  ...createStorageManager<Bookmark>(STORAGE_KEYS.BOOKMARKS),

  // Alias for getById
  get(id: string): Bookmark | undefined {
    return this.getById(id);
  },

  getByUserId(userId: string): Bookmark[] {
    return this.getAll().filter((bookmark) => bookmark.userId === userId);
  },

  isBookmarked(userId: string, postId: string): boolean {
    return this.getAll().some(
      (bookmark) => bookmark.userId === userId && bookmark.postId === postId
    );
  },

  toggle(userId: string, postId: string): boolean {
    const bookmarks = this.getAll();
    const existingIndex = bookmarks.findIndex(
      (bookmark) => bookmark.userId === userId && bookmark.postId === postId
    );

    if (existingIndex !== -1) {
      bookmarks.splice(existingIndex, 1);
      this.save(bookmarks);
      return false;
    } else {
      const newBookmark: Bookmark = {
        id: generateId(),
        userId,
        postId,
        createdAt: new Date().toISOString(),
      };
      this.add(newBookmark);
      return true;
    }
  },
};

export const contactStorage = createStorageManager<ContactMessage>(
  STORAGE_KEYS.CONTACT_MESSAGES
);

// Utility functions
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return formatDate(dateString);
  }
}
