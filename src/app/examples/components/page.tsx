import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function ComponentsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link href="/examples">
            <ArrowLeft className="size-4" />
            예제 목록으로
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">컴포넌트 쇼케이스</h1>
        <p className="mt-2 text-muted-foreground">모든 UI 컴포넌트의 실제 동작을 확인하고 코드 예제를 살펴보세요.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Button</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="xs">XS</Button>
              <Button size="sm">SM</Button>
              <Button size="default">Default</Button>
              <Button size="lg">LG</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Badge</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Alert</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Alert>
              <AlertTitle>안내</AlertTitle>
              <AlertDescription>기본 알림 메시지입니다.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>오류가 발생했습니다. 다시 시도해주세요.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Avatar</CardTitle></CardHeader>
          <CardContent className="flex gap-3">
            <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>EF</AvatarFallback></Avatar>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Accordion</CardTitle></CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Next.js란?</AccordionTrigger>
                <AccordionContent>React 기반의 풀스택 웹 프레임워크입니다. App Router를 통해 서버/클라이언트 컴포넌트를 유연하게 조합할 수 있습니다.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Tailwind CSS란?</AccordionTrigger>
                <AccordionContent>유틸리티 우선 CSS 프레임워크입니다. 미리 정의된 클래스를 조합해 빠르게 스타일링할 수 있습니다.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>TypeScript란?</AccordionTrigger>
                <AccordionContent>JavaScript의 타입 안전 슈퍼셋입니다. 컴파일 타임에 오류를 발견해 런타임 버그를 줄여줍니다.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tabs</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">첫 번째 탭</TabsTrigger>
                <TabsTrigger value="tab2">두 번째 탭</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4 text-sm text-muted-foreground">
                첫 번째 탭의 콘텐츠입니다. TabsTrigger를 클릭해 탭을 전환해보세요.
              </TabsContent>
              <TabsContent value="tab2" className="mt-4 text-sm text-muted-foreground">
                두 번째 탭의 콘텐츠입니다. 각 탭에 독립적인 콘텐츠를 배치할 수 있습니다.
              </TabsContent>
            </Tabs>
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
