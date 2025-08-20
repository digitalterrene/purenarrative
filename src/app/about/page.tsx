import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  Users,
  MessageCircle,
  Zap,
  Heart,
  Shield,
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: BookOpen,
      title: "Rich Writing Experience",
      description:
        "Create beautiful articles with our advanced editor supporting markdown, images, and more.",
    },
    {
      icon: Users,
      title: "Community Focused",
      description:
        "Connect with like-minded writers and readers in a supportive community environment.",
    },
    {
      icon: MessageCircle,
      title: "Engaging Discussions",
      description:
        "Foster meaningful conversations through comments and interactive features.",
    },
    {
      icon: Zap,
      title: "Fast & Modern",
      description:
        "Built with cutting-edge technology for optimal performance and user experience.",
    },
    {
      icon: Heart,
      title: "Reader-Friendly",
      description:
        "Beautiful typography and reading experience designed for maximum engagement.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is protected with industry-standard security measures.",
    },
  ];

  const stats = [
    { number: "1000+", label: "Articles Published" },
    { number: "5000+", label: "Active Readers" },
    { number: "500+", label: "Writers" },
    { number: "10k+", label: "Comments" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-background to-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            About Pure Narrative
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Where Stories Come to Life
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Pure Narrative is a modern blogging platform designed for writers
            who want to share their ideas, connect with readers, and build
            meaningful communities around their content.
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
              <Link href="/">Explore Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-border/40">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Modern Writers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, share, and grow your audience in
              one beautiful platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="card-hover">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that everyone has a story worth telling. Pure Narrative
              was created to democratize publishing and give writers the tools
              they need to share their ideas with the world. Whether you're a
              seasoned blogger or just starting your writing journey, we're here
              to support your creative process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">
                Why Choose Pure Narrative?
              </h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                  <span>Clean, distraction-free writing environment</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                  <span>Built-in SEO optimization for better reach</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                  <span>Responsive design that looks great everywhere</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                  <span>Community features to grow your audience</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                  <span>Analytics to understand your readers</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Open Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Pure Narrative is built with modern web technologies and
                    follows open-source principles. This ensures transparency,
                    security, and continuous improvement.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Always Free</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We believe in keeping writing accessible to everyone. Core
                    features will always remain free, with optional premium
                    features for advanced users.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of writers who are already sharing their stories on
            Pure Narrative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="btn-hover-lift">
              <Link href="/register">Create Your Account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="btn-hover-lift"
            >
              <Link href="/">Read Some Posts</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
