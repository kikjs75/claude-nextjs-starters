"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useToggle, useLocalStorage, useDebounceValue, useWindowSize } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function HooksPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const [isOn, toggle] = useToggle(false)
  const [storedName, setStoredName] = useLocalStorage("example-name", "")
  const [inputValue, setInputValue] = useState("")
  const [debouncedValue, setDebouncedValue] = useDebounceValue("", 500)
  const { width, height } = useWindowSize()

  const handleDebounceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setDebouncedValue(e.target.value)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link href="/examples">
            <ArrowLeft className="size-4" />
            예제 목록으로
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">usehooks-ts 예제</h1>
        <p className="mt-2 text-muted-foreground">usehooks-ts 라이브러리의 실용적인 훅 사용 예제입니다.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>useToggle</CardTitle>
            <CardDescription>불리언 값을 쉽게 토글합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant={isOn ? "default" : "secondary"}>{isOn ? "ON" : "OFF"}</Badge>
              <span className="text-sm text-muted-foreground">
                현재 상태: {isOn ? "활성" : "비활성"}
              </span>
            </div>
            <Button
              onClick={() => toggle()}
              variant={isOn ? "default" : "outline"}
              className="w-full"
            >
              토글하기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>useLocalStorage</CardTitle>
            <CardDescription>로컬스토리지에 값을 저장하고 읽습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="이름을 입력하세요"
              value={storedName}
              onChange={(e) => setStoredName(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              저장된 값:{" "}
              <span className="font-medium text-foreground">{storedName || "(없음)"}</span>
            </p>
            <p className="text-xs text-muted-foreground">새로고침 후에도 값이 유지됩니다.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>useDebounce</CardTitle>
            <CardDescription>입력값을 500ms 지연 후 반영합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="텍스트를 입력하세요"
              value={inputValue}
              onChange={handleDebounceChange}
            />
            <div className="space-y-1.5 rounded-lg border p-3">
              <p className="text-sm">
                즉시 값: <span className="font-medium">{inputValue || "(없음)"}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                디바운스 값:{" "}
                <span className="font-medium text-foreground">{debouncedValue || "(없음)"}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>useWindowSize</CardTitle>
            <CardDescription>현재 브라우저 창 크기를 실시간으로 감지합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between rounded-lg border p-3">
              <span className="text-sm text-muted-foreground">너비</span>
              <span className="font-mono font-medium">{mounted ? (width ?? "—") : "—"} px</span>
            </div>
            <div className="flex justify-between rounded-lg border p-3">
              <span className="text-sm text-muted-foreground">높이</span>
              <span className="font-mono font-medium">{mounted ? (height ?? "—") : "—"} px</span>
            </div>
            <p className="text-xs text-muted-foreground">창 크기를 변경해보세요.</p>
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
