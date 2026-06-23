import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Button variant="ghost" size="sm" className="mb-8 -ml-2" asChild>
        <Link href="/">
          <ArrowLeft className="size-4" />
          홈으로
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">이용약관</h1>
      <p className="text-sm text-muted-foreground mb-8">최종 수정일: 2026년 6월 23일</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-7">
        <section>
          <h2 className="text-xl font-semibold mb-3">제1조 (목적)</h2>
          <p className="text-muted-foreground">
            이 약관은 NextStarter가 제공하는 서비스의 이용 조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">제2조 (서비스 이용)</h2>
          <p className="text-muted-foreground">
            서비스는 회원가입 후 이용 가능하며, 운영자는 서비스 내용을 변경하거나 중단할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">제3조 (금지 행위)</h2>
          <p className="text-muted-foreground">
            서비스를 이용하여 타인의 권리를 침해하거나 법령에 위반되는 행위를 해서는 안 됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">제4조 (면책)</h2>
          <p className="text-muted-foreground">
            운영자는 서비스 이용으로 발생한 손해에 대해 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
          </p>
        </section>
      </div>
    </div>
  )
}
