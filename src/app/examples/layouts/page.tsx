import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

function ColorBlock({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-md border border-primary/20 bg-primary/10 p-4 text-sm font-medium text-primary ${className}`}
    >
      {label}
    </div>
  )
}

export default function LayoutsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link href="/examples">
            <ArrowLeft className="size-4" />
            예제 목록으로
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">레이아웃 예제</h1>
        <p className="mt-2 text-muted-foreground">다양한 레이아웃 패턴과 반응형 디자인 구현 방법입니다.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>반응형 그리드 (1 → 2 → 3열)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {["항목 1", "항목 2", "항목 3", "항목 4", "항목 5", "항목 6"].map((label) => (
                <ColorBlock key={label} label={label} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flex 레이아웃</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">가로 배치 (flex-row)</p>
            <div className="flex gap-3">
              {["A", "B", "C"].map((l) => (
                <ColorBlock key={l} label={l} className="flex-1" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">세로 배치 (flex-col)</p>
            <div className="flex flex-col gap-3">
              {["X", "Y", "Z"].map((l) => (
                <ColorBlock key={l} label={l} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">가운데 정렬 (justify-center + items-center)</p>
            <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
              <ColorBlock label="가운데" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bento 그리드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <ColorBlock label="넓은 블록 (col-span-2)" className="col-span-2 py-8" />
              <ColorBlock label="세로 (row-span-2)" className="row-span-2 py-8" />
              <ColorBlock label="블록 A" />
              <ColorBlock label="블록 B" />
              <ColorBlock label="가로 블록 (col-span-2)" className="col-span-2" />
              <ColorBlock label="블록 C" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>사이드바 레이아웃</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <ColorBlock label="사이드바 (w-48)" className="w-48 shrink-0 py-16" />
              <ColorBlock label="메인 콘텐츠 (flex-1)" className="flex-1 py-16" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <Button variant="outline" asChild>
          <Link href="/examples">
            <ArrowLeft className="size-4" />
            예제 목록
          </Link>
        </Button>
      </div>
    </div>
  )
}
