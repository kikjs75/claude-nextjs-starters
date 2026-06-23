import Link from "next/link"
import { siteConfig } from "@/config/site"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <nav className="flex items-center gap-4">
          {siteConfig.footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
