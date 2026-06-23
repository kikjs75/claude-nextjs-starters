"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Users, TrendingUp, Activity, DollarSign, Bell } from "lucide-react"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DataTable } from "@/components/ui/data-table"

// ─── 타입 ───────────────────────────────────────────────────────────────────

type User = {
  id: number
  name: string
  email: string
  role: string
  status: "활성" | "비활성"
}

type Stat = {
  label: string
  value: string
  change: string
  positive: boolean
  icon: React.ElementType
}

// ─── 더미 데이터 ─────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { label: "총 방문자", value: "12,345", change: "+12%", positive: true, icon: Users },
  { label: "이번 달 수익", value: "₩2,345,000", change: "+5.2%", positive: true, icon: DollarSign },
  { label: "활성 사용자", value: "1,234", change: "+8%", positive: true, icon: Activity },
  { label: "전환율", value: "3.4%", change: "-0.2%", positive: false, icon: TrendingUp },
]

const USERS: User[] = [
  { id: 1, name: "홍길동", email: "hong@example.com", role: "관리자", status: "활성" },
  { id: 2, name: "김철수", email: "kim@example.com", role: "개발자", status: "활성" },
  { id: 3, name: "이영희", email: "lee@example.com", role: "디자이너", status: "비활성" },
  { id: 4, name: "박민준", email: "park@example.com", role: "개발자", status: "활성" },
  { id: 5, name: "최수진", email: "choi@example.com", role: "마케터", status: "활성" },
  { id: 6, name: "정도윤", email: "jung@example.com", role: "개발자", status: "비활성" },
  { id: 7, name: "강지원", email: "kang@example.com", role: "디자이너", status: "활성" },
  { id: 8, name: "윤서연", email: "yoon@example.com", role: "관리자", status: "활성" },
]

const RECENT_ACTIVITY = [
  { id: 1, user: "홍길동", action: "새 사용자로 가입했습니다.", time: "2분 전", avatar: "홍" },
  { id: 2, user: "김철수", action: "프로필을 업데이트했습니다.", time: "15분 전", avatar: "김" },
  { id: 3, user: "이영희", action: "결제를 완료했습니다.", time: "1시간 전", avatar: "이" },
  { id: 4, user: "박민준", action: "새 프로젝트를 생성했습니다.", time: "3시간 전", avatar: "박" },
]

// ─── 테이블 컬럼 정의 ────────────────────────────────────────────────────────

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "이름",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "이메일",
    enableSorting: false,
  },
  {
    accessorKey: "role",
    header: "역할",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "활성" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
    enableSorting: true,
  },
]

// ─── react-query로 통계 데이터 페칭 예시 ────────────────────────────────────

async function fetchStats(): Promise<Stat[]> {
  // 실제 앱에서는 fetch('/api/stats') 등으로 대체
  await new Promise((r) => setTimeout(r, 800))
  return STATS
}

// ─── 컴포넌트 ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-sm text-muted-foreground">전체 현황을 한눈에 확인하세요.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => toast.success("알림을 확인했습니다!", { description: "새로운 알림이 없습니다." })}
        >
          <Bell className="size-4" />
          Toast 테스트
        </Button>
      </div>

      {/* 통계 카드 — react-query 로딩 → Skeleton → 데이터 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-20 mb-1" />
                  <Skeleton className="h-5 w-12" />
                </CardContent>
              </Card>
            ))
          : (stats ?? STATS).map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                  <stat.icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <Badge variant={stat.positive ? "default" : "destructive"} className="mt-1">
                    {stat.change}
                  </Badge>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Tabs: 사용자 테이블 / 최근 활동 */}
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">사용자 목록</TabsTrigger>
          <TabsTrigger value="activity">최근 활동</TabsTrigger>
        </TabsList>

        {/* 사용자 테이블 — TanStack Table + nuqs URL 상태 */}
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>사용자 관리</CardTitle>
              <CardDescription>
                이름으로 검색하고, 컬럼 헤더를 클릭해 정렬하세요. 검색어와 페이지는 URL에 저장됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={USERS}
                searchColumn="name"
                searchPlaceholder="이름으로 검색..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 최근 활동 */}
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>최근 활동</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RECENT_ACTIVITY.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{item.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.user}</p>
                      <p className="text-sm text-muted-foreground truncate">{item.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
