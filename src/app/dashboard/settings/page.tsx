import { Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">설정</h1>
        <p className="text-sm text-muted-foreground">애플리케이션 환경을 관리합니다.</p>
      </div>

      <Separator />

      <div className="flex flex-col gap-4 max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Settings className="size-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">일반 설정</CardTitle>
              <CardDescription>기본 애플리케이션 설정을 관리합니다.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">준비 중입니다.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">알림 설정</CardTitle>
            <CardDescription>알림 수신 방식을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">준비 중입니다.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
