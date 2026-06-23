import { Suspense } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

function DashboardFallback() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Suspense fallback={<DashboardFallback />}>{children}</Suspense>
      </div>
    </div>
  )
}
