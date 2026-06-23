import Link from "next/link"
import { ArrowRight, Zap, Shield, Layers, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const features = [
  {
    icon: Zap,
    badge: "성능",
    title: "빠른 시작",
    description:
      "Next.js 16 App Router와 React 19 기반으로 최신 웹 표준을 즉시 활용할 수 있습니다. 설정 없이 바로 개발을 시작하세요.",
  },
  {
    icon: Shield,
    badge: "TypeScript",
    title: "타입 안전성",
    description:
      "TypeScript 5와 Zod 스키마 검증으로 런타임 에러를 컴파일 타임에 잡습니다. 안전하고 예측 가능한 코드를 작성하세요.",
  },
  {
    icon: Layers,
    badge: "UI",
    title: "모던 UI 컴포넌트",
    description:
      "ShadcnUI와 Radix UI 기반의 접근성 높은 컴포넌트를 제공합니다. Tailwind CSS 4로 자유롭게 커스터마이징하세요.",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="container mx-auto flex flex-col items-center gap-6 px-4 py-24 text-center md:py-32">
        <Badge variant="secondary">Next.js 16 + React 19 + TypeScript</Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          모던 웹 개발의
          <br />
          완벽한 시작점
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          검증된 기술 스택으로 즉시 프로덕션 수준의 웹 서비스를 시작하세요. 반복적인 보일러플레이트 설정은 이제 그만.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/dashboard">
              대시보드 보기
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <GitBranch className="size-4" />
              GitHub
            </Link>
          </Button>
        </div>
      </section>

      {/* 기능 카드 섹션 */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="gap-3">
                <feature.icon className="size-8 text-primary" />
                <Badge variant="outline" className="w-fit">
                  {feature.badge}
                </Badge>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* 기술 스택 뱃지 */}
      <section className="border-y border-border bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <p className="mb-6 text-center text-sm text-muted-foreground">포함된 기술 스택</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Next.js 16",
              "React 19",
              "TypeScript 5",
              "Tailwind CSS 4",
              "ShadcnUI",
              "next-themes",
              "TanStack Query",
              "TanStack Table",
              "react-hook-form",
              "Zod",
              "nuqs",
              "usehooks-ts",
              "sonner",
              "lucide-react",
            ].map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="container mx-auto flex flex-col items-center gap-6 px-4 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight">지금 바로 시작하세요</h2>
        <p className="max-w-md text-muted-foreground">
          대시보드 예시에서 TanStack Table, react-query, sonner toast 등의 실제 사용 패턴을 확인하세요.
        </p>
        <Button size="lg" asChild>
          <Link href="/dashboard">
            대시보드 보기
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
