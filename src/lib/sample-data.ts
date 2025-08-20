import {
  userStorage,
  postStorage,
  categoryStorage,
  commentStorage,
  calculateReadingTime,
  generateSlug,
} from "./storage";
import { User, BlogPost, Category, Comment } from "./types";

const sampleUsers: Omit<User, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "John Doe",
    email: "john@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "Tech enthusiast and full-stack developer with a passion for creating innovative solutions.",
    role: "admin",
    isVerified: true,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    bio: "UI/UX designer focused on creating beautiful and accessible user experiences.",
    role: "user",
    isVerified: true,
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    bio: "Data scientist and AI researcher exploring the future of machine learning.",
    role: "user",
    isVerified: true,
  },
  {
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    bio: "Product manager with experience in scaling tech startups and building user-centric products.",
    role: "user",
    isVerified: false,
  },
];

const sampleCategories: Omit<Category, "id" | "createdAt">[] = [
  {
    name: "Technology",
    slug: "technology",
    description: "Latest trends and insights in technology",
    color: "#3B82F6",
  },
  {
    name: "Design",
    slug: "design",
    description: "UI/UX design principles and best practices",
    color: "#8B5CF6",
  },
  {
    name: "Development",
    slug: "development",
    description: "Programming tutorials and development guides",
    color: "#10B981",
  },
  {
    name: "Business",
    slug: "business",
    description: "Business strategies and entrepreneurship",
    color: "#F59E0B",
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Personal development and lifestyle tips",
    color: "#EF4444",
  },
];

const samplePosts = [
  {
    title: "Getting Started with React 18: New Features and Best Practices",
    content: `
      <h2>Introduction to React 18</h2>
      <p>React 18 brings exciting new features that make building user interfaces more efficient and enjoyable. In this comprehensive guide, we'll explore the key improvements and how to leverage them in your projects.</p>
      
      <h3>Concurrent Features</h3>
      <p>One of the most significant additions is concurrent rendering, which allows React to work on multiple tasks simultaneously without blocking the main thread.</p>
      
      <h3>Automatic Batching</h3>
      <p>React 18 automatically batches state updates in more scenarios, reducing the number of re-renders and improving performance.</p>
      
      <h3>Suspense Improvements</h3>
      <p>Enhanced Suspense capabilities make it easier to handle loading states and code splitting in your applications.</p>
      
      <p>These features represent a major step forward in React's evolution, making it more powerful and developer-friendly than ever before.</p>
    `,
    excerpt:
      "Discover the powerful new features in React 18 and learn how to implement them in your projects for better performance and user experience.",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    categories: ["technology", "development"],
    tags: ["React", "JavaScript", "Frontend", "Performance"],
    status: "published" as const,
  },
  {
    title: "The Art of Minimalist Design: Less is More",
    content: `
      <h2>Understanding Minimalism in Design</h2>
      <p>Minimalist design isn't just about using less elements—it's about using the right elements to create maximum impact with minimal clutter.</p>
      
      <h3>Key Principles</h3>
      <ul>
        <li>Focus on essential elements</li>
        <li>Use plenty of white space</li>
        <li>Choose a limited color palette</li>
        <li>Prioritize typography</li>
      </ul>
      
      <h3>Benefits of Minimalist Design</h3>
      <p>Minimalist design improves user experience by reducing cognitive load and making interfaces more intuitive and accessible.</p>
      
      <p>When done correctly, minimalist design creates elegant, timeless solutions that stand the test of time.</p>
    `,
    excerpt:
      "Explore the principles of minimalist design and learn how to create impactful user interfaces with less clutter and more focus.",
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop",
    categories: ["design"],
    tags: ["Design", "Minimalism", "UI/UX", "Typography"],
    status: "published" as const,
  },
  {
    title: "Building Scalable APIs with Node.js and Express",
    content: `
      <h2>Setting Up Your Express Server</h2>
      <p>Learn how to build robust, scalable APIs using Node.js and Express framework with modern best practices.</p>
      
      <h3>Project Structure</h3>
      <p>Organizing your code properly is crucial for maintainability and scalability.</p>
      
      <h3>Middleware Implementation</h3>
      <p>Implement authentication, validation, and error handling middleware for a production-ready API.</p>
      
      <h3>Database Integration</h3>
      <p>Connect your API to databases and implement efficient data access patterns.</p>
      
      <p>By following these patterns, you'll create APIs that can handle growth and maintain performance at scale.</p>
    `,
    excerpt:
      "Learn to build production-ready APIs with Node.js and Express, covering best practices for scalability and maintainability.",
    coverImage:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
    categories: ["development", "technology"],
    tags: ["Node.js", "Express", "API", "Backend"],
    status: "published" as const,
  },
  {
    title: "The Future of Remote Work: Trends and Predictions",
    content: `
      <h2>Remote Work Evolution</h2>
      <p>The pandemic accelerated remote work adoption, but what does the future hold for distributed teams?</p>
      
      <h3>Hybrid Work Models</h3>
      <p>Companies are embracing flexible hybrid models that combine remote and in-office work.</p>
      
      <h3>Technology Enablers</h3>
      <p>New tools and platforms are making remote collaboration more effective than ever.</p>
      
      <h3>Cultural Shifts</h3>
      <p>Organizations are adapting their cultures to support distributed teams and maintain company values.</p>
      
      <p>The future of work is flexible, technology-enabled, and focused on outcomes rather than location.</p>
    `,
    excerpt:
      "Explore the evolving landscape of remote work and discover trends shaping the future of how we collaborate and build businesses.",
    coverImage:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop",
    categories: ["business"],
    tags: ["Remote Work", "Business", "Future", "Productivity"],
    status: "published" as const,
  },
  {
    title: "Mastering TypeScript: Advanced Types and Patterns",
    content: `
      <h2>Advanced TypeScript Concepts</h2>
      <p>Take your TypeScript skills to the next level with advanced types, patterns, and best practices.</p>
      
      <h3>Generic Types</h3>
      <p>Learn how to create flexible, reusable code with generic types and constraints.</p>
      
      <h3>Conditional Types</h3>
      <p>Master conditional types to create sophisticated type logic and better API designs.</p>
      
      <h3>Utility Types</h3>
      <p>Leverage built-in utility types and create your own to solve common typing challenges.</p>
      
      <p>These advanced concepts will help you write more robust, maintainable TypeScript code.</p>
    `,
    excerpt:
      "Dive deep into advanced TypeScript features and learn patterns that will make your code more robust and maintainable.",
    coverImage:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
    categories: ["development", "technology"],
    tags: ["TypeScript", "JavaScript", "Programming", "Types"],
    status: "published" as const,
  },
  {
    title: "Work-Life Balance in the Digital Age",
    content: `
      <h2>Finding Balance</h2>
      <p>In our always-connected world, maintaining work-life balance has become more challenging yet more important than ever.</p>
      
      <h3>Setting Boundaries</h3>
      <p>Learn strategies for creating clear boundaries between work and personal time.</p>
      
      <h3>Digital Wellness</h3>
      <p>Manage your relationship with technology to reduce stress and improve well-being.</p>
      
      <h3>Time Management</h3>
      <p>Effective time management techniques that help you be productive without burning out.</p>
      
      <p>Achieving balance is an ongoing process that requires intentional choices and regular adjustments.</p>
    `,
    excerpt:
      "Discover practical strategies for maintaining work-life balance in our hyper-connected digital world.",
    coverImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    categories: ["lifestyle"],
    tags: ["Work-Life Balance", "Wellness", "Productivity", "Mental Health"],
    status: "published" as const,
  },
];

export function initializeSampleData() {
  // Only initialize if no data exists
  if (userStorage.getAll().length > 0) return;

  console.log("Initializing sample data...");

  // Create users with generated IDs and timestamps
  const users = sampleUsers.map((userData) =>
    userStorage.add({
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  );

  // Create categories with generated IDs and timestamps
  const categories = sampleCategories.map((categoryData) =>
    categoryStorage.add({
      ...categoryData,
      createdAt: new Date().toISOString(),
    })
  );

  // Create posts with all required fields
  samplePosts.forEach((postData, index) => {
    const author = users[index % users.length];
    const categoryIds = postData.categories.map((slug) => {
      const category = categories.find((c) => c.slug === slug);
      return category?.id || categories[0].id;
    });

    const post = postStorage.add({
      ...postData,
      slug: generateSlug(postData.title),
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      categories: categoryIds,
      readingTime: calculateReadingTime(postData.content),
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Add some comments to posts
    if (index < 4) {
      const commentAuthors = users
        .filter((u) => u.id !== author.id)
        .slice(0, 2);
      commentAuthors.forEach((commentAuthor, commentIndex) => {
        commentStorage.add({
          postId: post.id,
          postTitle: post.title,
          authorId: commentAuthor.id,
          authorName: commentAuthor.name,
          authorAvatar: commentAuthor.avatar,
          content: `This is a great article! Thanks for sharing these insights. ${
            commentIndex === 0
              ? "I especially found the section about best practices very helpful."
              : "Looking forward to implementing these ideas in my next project."
          }`,
          isVerified: commentAuthor.isVerified,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    }
  });
}
