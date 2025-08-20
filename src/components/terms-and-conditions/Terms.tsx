import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollText, Shield, BookOpen } from "lucide-react";

export default function Terms() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content:
        "By accessing or using the Pure Narrative platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.",
    },
    {
      title: "User Responsibilities",
      content:
        "You are responsible for maintaining the confidentiality of your account and password. All content you post must comply with applicable laws and must not infringe on the rights of others.",
    },
    {
      title: "Content Ownership",
      content:
        "You retain ownership of any intellectual property rights that you hold in the content you submit or post. By posting content, you grant Pure Narrative a worldwide license to use, display, and distribute your content.",
    },
    {
      title: "Prohibited Conduct",
      content:
        "You agree not to engage in activities that: are unlawful, offensive, or harmful; violate others' privacy; involve spamming or phishing; or attempt to disrupt the service's operation.",
    },
    {
      title: "Termination",
      content:
        "We may terminate or suspend access to our service immediately, without prior notice, for any breach of these Terms. All provisions of the Terms shall survive termination.",
    },
    {
      title: "Limitation of Liability",
      content:
        "Pure Narrative shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.",
    },
    {
      title: "Changes to Terms",
      content:
        "We reserve the right to modify these terms at any time. Your continued use of the service after changes constitutes acceptance of the new terms.",
    },
    {
      title: "Governing Law",
      content:
        "These Terms shall be governed by the laws of the jurisdiction where Pure Narrative is established, without regard to its conflict of law provisions.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-background to-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 mx-auto">
            <ScrollText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {index === 0 && (
                      <BookOpen className="w-5 h-5 text-primary" />
                    )}
                    {index === 3 && <Shield className="w-5 h-5 text-primary" />}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold mb-4">Questions?</h3>
            <p className="text-muted-foreground mb-6">
              If you have any questions about these Terms, please contact us.
            </p>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
