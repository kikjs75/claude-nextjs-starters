import Link from "next/link"
import { Menu } from "lucide-react"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center gap-4 px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          {siteConfig.name}
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {siteConfig.nav.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <Link href={item.href}>{item.title}</Link>
            </Button>
          ))}
        </nav>

        {/* 우측 영역 */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {/* 모바일 햄버거 메뉴 */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="메뉴 열기">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-6">
                {siteConfig.nav.map((item) => (
                  <Button key={item.href} variant="ghost" className="justify-start" asChild>
                    <Link href={item.href}>{item.title}</Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
