export type NavItem = {
  title: string
  href: string
  external?: boolean
}

export type SiteConfig = {
  name: string
  description: string
  url: string
  nav: NavItem[]
  dashboardNav: NavItem[]
  footerNav: NavItem[]
}

export const siteConfig: SiteConfig = {
  name: "NextStarter",
  description: "Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · ShadcnUI 기반 모던 웹 스타터킷",
  url: "https://nextstarter.dev",
  nav: [
    { title: "홈", href: "/" },
    { title: "대시보드", href: "/dashboard" },
  ],
  dashboardNav: [
    { title: "대시보드", href: "/dashboard" },
    { title: "사용자", href: "/dashboard/users" },
    { title: "설정", href: "/dashboard/settings" },
  ],
  footerNav: [
    { title: "GitHub", href: "https://github.com", external: true },
    { title: "개인정보처리방침", href: "/privacy" },
    { title: "이용약관", href: "/terms" },
  ],
}
