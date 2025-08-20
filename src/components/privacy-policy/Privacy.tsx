import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lock, Shield, Server, Mail } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      title: "Information We Collect",
      content:
        "We collect information you provide directly (account details, content), automatically (usage data, cookies), and from third parties (social media integrations).",
    },
    {
      title: "How We Use Information",
      content:
        "Your information is used to: provide and improve our services, communicate with you, ensure security, analyze usage, and personalize content.",
    },
    {
      title: "Data Sharing",
      content:
        "We may share data with: service providers (hosting, analytics), when required by law, to protect rights, or with your consent. We never sell your personal data.",
    },
    {
      title: "Cookies & Tracking",
      content:
        "We use cookies and similar technologies to analyze trends, administer the website, track user movements, and gather demographic information.",
    },
    {
      title: "Data Security",
      content:
        "We implement security measures including encryption, access controls, and regular audits. However, no method is 100% secure and we cannot guarantee absolute security.",
    },
    {
      title: "Your Rights",
      content:
        "You may access, correct, or delete your personal data. You can object to processing, request restrictions, or data portability. Contact us to exercise these rights.",
    },
    {
      title: "Children's Privacy",
      content:
        "Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13 without parental consent.",
    },
    {
      title: "Changes to This Policy",
      content:
        'We may update this policy. We will notify you of significant changes and indicate the "Last Updated" date at the top of this page.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-background to-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Privacy Policy
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

      {/* Privacy Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Pure Narrative, we take your privacy seriously. This policy
              explains what information we collect, how we use it, and your
              rights regarding your personal data.
            </p>
          </div>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {index === 0 && <Server className="w-5 h-5 text-primary" />}
                    {index === 4 && <Shield className="w-5 h-5 text-primary" />}
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
            <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
            <p className="text-muted-foreground mb-6">
              If you have any questions about this Privacy Policy, please
              contact our Data Protection Officer.
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-primary" />
              <span>privacy@nexus.example</span>
            </div>
            <Button asChild>
              <Link href="/contact">Contact Form</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
