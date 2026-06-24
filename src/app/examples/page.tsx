import Link from "next/link"
import { Layers, FileText, Layout, Code2, Database, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const examples = [
  {
    icon: Layers,
    title: "컴포넌트 쇼케이스",
    description: "모든 UI 컴포넌트의 실제 동작을 확인하고 코드 예제를 살펴보세요.",
    tags: ["UI/UX", "인터랙티브"],
    href: "/examples/components",
  },
  {
    icon: FileText,
    title: "폼 예제",
    description: "react-hook-form과 zod를 활용한 다양한 폼 구현 예제입니다.",
    tags: ["검증", "상태관리"],
    href: "/examples/forms",
  },
  {
    icon: Layout,
    title: "레이아웃 예제",
    description: "다양한 레이아웃 패턴과 반응형 디자인 구현 방법을 확인하세요.",
    tags: ["반응형", "레이아웃"],
    href: "/examples/layouts",
  },
  {
    icon: Code2,
    title: "usehooks-ts 예제",
    description: "usehooks-ts 라이브러리의 다양한 훅 사용법과 실용적인 예제들입니다.",
    tags: ["훅", "유틸리티"],
    href: "/examples/hooks",
  },
  {
    icon: Database,
    title: "데이터 페칭",
    description: "API 호출, 로딩 상태, 에러 처리 등 데이터 관리 예제입니다.",
    tags: ["API", "비동기"],
    href: "/examples/data-fetching",
  },
  {
    icon: Settings,
    title: "설정 및 최적화",
    description: "성능 최적화, SEO 설정, PWA 구현 등 프로덕션 환경을 위한 설정들입니다.",
    tags: ["최적화", "SEO"],
    href: "/examples/optimization",
  },
]

export default function ExamplesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">예제 모음</h1>
        <p className="max-w-xl text-muted-foreground">
          실제 동작하는 예제를 통해 스타터킷의 모든 기능을 탐색해보세요. 각 예제는 소스 코드와 함께
          제공됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example) => (
          <Card key={example.title} className="flex flex-col">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg border bg-muted">
                  <example.icon className="size-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">{example.title}</CardTitle>
              </div>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-0">
              <div className="flex flex-wrap gap-1.5">
                {example.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button asChild className="w-full">
                <Link href={example.href}>예제 보기</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        각 예제는 실제 코드와 함께 제공되며 자유롭게 복사하여 사용할 수 있습니다.
      </p>
    </div>
  )
}
