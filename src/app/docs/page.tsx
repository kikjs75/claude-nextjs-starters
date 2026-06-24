import Link from "next/link"
import { Monitor, Puzzle, Code2, Settings, FileText, GitBranch, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const sections = [
  {
    icon: Monitor,
    title: "시작하기",
    description: "프로젝트 설정, 개발 환경 구성, 첫 번째 애플리케이션 만들기",
    items: ["설치 및 설정", "프로젝트 구조", "개발 서버 실행", "빌드 및 배포"],
  },
  {
    icon: Puzzle,
    title: "UI 컴포넌트",
    description: "ShadcnUI 컴포넌트 사용법과 커스터마이징 방법",
    items: ["기본 컴포넌트", "테마 설정", "다크모드 구현", "커스텀 스타일링"],
  },
  {
    icon: Code2,
    title: "훅 라이브러리",
    description: "usehooks-ts를 활용한 React 훅 사용법과 실용적인 예제",
    items: ["상태 관리 훅", "이벤트 훅", "브라우저 API 훅", "유틸리티 훅"],
  },
  {
    icon: Settings,
    title: "구성 및 설정",
    description: "프로젝트 환경설정, 최적화, SEO 및 성능 튜닝",
    items: ["환경 변수", "TypeScript 설정", "코드 분할", "PWA 설정"],
  },
]

const quickLinks = [
  {
    icon: FileText,
    title: "README",
    description: "프로젝트 개요 및 시작 가이드",
    href: "https://github.com",
    external: true,
  },
  {
    icon: GitBranch,
    title: "GitHub",
    description: "소스 코드 및 이슈 트래킹",
    href: "https://github.com",
    external: true,
  },
  {
    icon: Code2,
    title: "예제",
    description: "실제 동작하는 코드 예제",
    href: "/examples",
    external: false,
  },
]

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">문서</h1>
        <p className="max-w-xl text-muted-foreground">
          NextJS 스타터킷 사용법과 모든 기능에 대한 상세한 가이드를 제공합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader className="gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg border bg-muted">
                  <section.icon className="size-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="mb-3 text-sm font-medium text-muted-foreground">주요 내용</p>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <span className="size-1.5 rounded-full bg-primary/60 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 빠른 링크 */}
      <div className="mt-16">
        <h2 className="mb-6 text-center text-2xl font-bold">빠른 링크</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-10 items-center justify-center rounded-lg border bg-muted">
                <link.icon className="size-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{link.title}</p>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        문서는 지속적으로 업데이트됩니다. 궁금한 점이 있으시면 GitHub 이슈로 문의해주세요.
      </p>
    </div>
  )
}
