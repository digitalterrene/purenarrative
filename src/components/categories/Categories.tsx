"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, TrendingUp, PenSquare, Book } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Poetry",
    slug: "poetry",
    description:
      "Explore beautiful poems from talented writers around the world",
    icon: PenSquare,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    name: "Books",
    slug: "books",
    description: "Discover book reviews, summaries, and literary discussions",
    icon: Book,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Latest tech trends, tutorials, and innovation insights",
    icon: Code,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    name: "Business",
    slug: "business",
    description: "Entrepreneurship, finance, and career development resources",
    icon: TrendingUp,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    name: "Manuscripts",
    slug: "manuscripts",
    description:
      "Original works and drafts from emerging and established authors",
    icon: BookOpen,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
];

export default function Categories() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Content Categories</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our diverse collection of content across different categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className={`p-3 rounded-lg ${category.bgColor}`}>
                    <Icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    Explore {category.name}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold mb-4">
          Can't find what you're looking for?
        </h3>
        <p className="text-muted-foreground mb-6">
          Our categories are constantly growing. Suggest a new category or
          explore all content.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/suggest-category"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Suggest a Category
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-border rounded-md hover:bg-accent transition-colors"
          >
            Explore All Content
          </Link>
        </div>
      </div>
    </div>
  );
}
