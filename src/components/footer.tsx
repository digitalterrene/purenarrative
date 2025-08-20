import Link from "next/link";
import {
  BookOpen,
  Twitter,
  Github,
  Linkedin,
  Mail,
  MoveUpRight,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    main: [
      { name: "Home", href: "/" },
      { name: "About Pure Narrative (App)", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms & Conditions", href: "/terms-and-conditions" },
    ],
    ap_records_keeping: [
      { name: "All Platform Users", href: "/users" },
      { name: "All Comments", href: "/comments" },
    ],
    social: [
      {
        name: "Twitter",
        href: "#",
        icon: Twitter,
      },
      {
        name: "GitHub",
        href: "#",
        icon: Github,
      },
      {
        name: "LinkedIn",
        href: "#",
        icon: Linkedin,
      },
      {
        name: "Email",
        href: "mailto:hello@nexusblog.com",
        icon: Mail,
      },
    ],
  };

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className=" ">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl gradient-text">
                Pure Narrative
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              A modern blogging platform where ideas come to life. Share your
              stories, connect with readers, and build your community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">AP Records Keeping</h3>
            <ul className="space-y-2">
              {navigation.ap_records_keeping.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={"https://www.authenticprofile.com/"}
                  target="_blank"
                  className="text-muted-foreground   flex   items-baseline gap-2 hover:text-primary transition-colors"
                >
                  <p className="-mb-1"> Authentic Profile </p>
                  <MoveUpRight className="text-xs  " size={18} />
                </Link>
              </li>
            </ul>
          </div>
          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Pure Narrative. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">
            Built with ❤️ By{" "}
            <Link href={"https://larrykingstone.com"} target="_blank">
              Larry Kingstone
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
