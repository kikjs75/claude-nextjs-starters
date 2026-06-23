# Next.js 16 App Router 모던 웹 스타터킷 구현 계획

## Context
기존 Create Next App 기반 프로젝트에 Next.js 16 / React 19 / TypeScript 5 / Tailwind CSS 4 / ShadcnUI / lucide-react가 설치되어 있음. 현재는 기본 button.tsx와 빈 홈페이지만 존재. 실제 개발에 바로 활용 가능한 레이아웃, 컴포넌트, 훅, 페이지 예시를 갖춘 스타터킷으로 완성하는 것이 목표.

---

## 기술 제약 사항

- Tailwind CSS 4: `tailwind.config.js` 없음 → `postcss.config.mjs` + `globals.css`의 `@theme inline` 방식
- 다크모드: `@custom-variant dark (&:is(.dark *))` → `document.documentElement`에 `.dark` 클래스 토글
- ShadcnUI 스타일: `radix-nova` (data-slot attribute 패턴, CVA 기반)
- Radix UI import: `import { Avatar, Label, Separator, Slot } from "radix-ui"` (단일 패키지)
- Path alias: `@/*` → `./src/*`
- RSC 우선, Client Component는 훅/이벤트 필요 시만 `'use client'`

---

## 구현 파일 목록 (의존성 순서)

### Phase 1 — 기반 설정
- `src/config/site.ts` (신규): 사이트명, 설명, nav, footerNav 정의 — 전체 설정의 단일 진실 소스

### Phase 2 — 훅 (병렬 생성 가능)
- `src/hooks/use-local-storage.ts`: SSR 가드 포함, 제네릭 localStorage 훅
- `src/hooks/use-media-query.ts`: SSR 기본값 false, useEffect에서 실제값 초기화
- `src/hooks/use-theme.ts`: 위 두 훅 조합, `preference(system|light|dark)` + `resolvedTheme` 반환, useEffect에서 `.dark` 클래스 토글

### Phase 3 — ShadcnUI 컴포넌트 (병렬 생성 가능)

| 파일 | 타입 | 설명 |
|------|------|------|
| `src/components/ui/card.tsx` | RSC | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| `src/components/ui/badge.tsx` | RSC | CVA로 default/secondary/destructive/outline variant |
| `src/components/ui/input.tsx` | RSC | `aria-invalid` 지원, `React.ComponentProps<"input">` 상속 |
| `src/components/ui/label.tsx` | Client | `radix-ui`의 Label.Root 래퍼 |
| `src/components/ui/separator.tsx` | Client | `radix-ui`의 Separator.Root 래퍼, horizontal/vertical orientation |
| `src/components/ui/avatar.tsx` | Client | `radix-ui`의 Avatar.Root/Image/Fallback 래퍼 3개 |

### Phase 4 — Providers
- `src/components/providers.tsx` (Client): ThemeSynchronizer 내부 컴포넌트가 `useTheme()` 호출하여 DOM dark 클래스 동기화, null 반환

### Phase 5 — 레이아웃 컴포넌트
- `src/components/layout/theme-toggle.tsx` (Client): `useTheme()` 사용, Sun/Moon 아이콘 토글 버튼
- `src/components/layout/header.tsx` (RSC): sticky top, logo + nav + ThemeToggle, `siteConfig.nav` 기반
- `src/components/layout/footer.tsx` (RSC): `siteConfig.footerNav` + copyright

### Phase 6 — 루트 레이아웃 수정

`src/app/layout.tsx` 수정 내용:
- `<html lang="ko" suppressHydrationWarning>` 추가
- `<head>`에 테마 flash 방지 인라인 스크립트 주입 (`dangerouslySetInnerHTML`)
- metadata를 `siteConfig`에서 가져오도록 변경 (`title.template` 포함)
- body 안에 `<Providers>` → `<Header>` → `<main>` → `<Footer>` 구조

```js
// flash 방지 스크립트 — 페인팅 전에 실행되어 dark 클래스를 미리 적용
(function(){
  try {
    var s = localStorage.getItem('theme');
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (s === 'dark' || (s === 'system' && d) || (s === null && d)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})()
```

### Phase 7 — 페이지
- `src/app/page.tsx` (수정, RSC): 히어로 섹션(Badge + h1 + CTA 버튼 2개) + 기능 카드 그리드(3개) + 하단 CTA
- `src/app/dashboard/page.tsx` (신규, RSC): metadata export(`title: "대시보드"`) + 통계 카드 4개 그리드 + 활동 목록/사용자 카드 2열 그리드

---

## 재사용할 기존 파일

- `src/components/ui/button.tsx` — 수정 없이 그대로 활용 (Slot.Root 패턴 참고)
- `src/lib/utils.ts` — `cn()` 함수 그대로 사용
- `src/app/globals.css` — CSS 변수/테마 시스템 수정 없음

---

## RSC (React Server Components) 개념

### 정의
서버에서만 실행되는 React 컴포넌트. Next.js 13+ App Router에서 기본값.

### Client Component vs Server Component

| 구분 | Client Component | Server Component (RSC) |
|------|-----------------|----------------------|
| 실행 위치 | 브라우저 | 서버 |
| 선언 방법 | `'use client'` 상단에 추가 | 아무것도 안 씀 (기본값) |
| `useState`, `useEffect` | 사용 가능 | 사용 불가 |
| DB/파일시스템 직접 접근 | 불가 | 가능 |
| 번들 크기 | JS로 브라우저에 전송됨 | 전송 안 됨 (HTML만 전송) |

### 예시

```tsx
// RSC — 서버에서 실행 (파일 상단에 아무것도 없음)
export default async function Page() {
  const data = await fetch('https://api.example.com/data') // async/await 직접 사용
  return <div>{data.title}</div>
}
```

```tsx
// Client Component — 브라우저에서 실행
'use client'

export default function Counter() {
  const [count, setCount] = useState(0) // 훅 사용 가능
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### 스타터킷의 RSC 전략

- **기본은 RSC**: 정적 레이아웃(Header, Footer), 페이지(홈, 대시보드), UI 컴포넌트(Card, Badge, Input)
- **`'use client'`는 필요할 때만**: 훅이나 이벤트 핸들러가 있는 경우 (ThemeToggle, Providers, Label, Avatar, Separator)
- **이점**: 불필요한 JS를 브라우저에 보내지 않아 성능 향상, API 키/DB 접근 코드 클라이언트 노출 없음

---

## 검증 방법

1. `npm run dev` 실행 후 `http://localhost:3000` 접속
2. 홈페이지: 히어로, 기능 카드 3개, CTA 섹션 정상 렌더링 확인
3. 헤더 ThemeToggle 클릭 → 다크/라이트 모드 전환 확인 (flash 없이)
4. 새로고침 후 테마 유지 여부 확인 (localStorage 저장 검증)
5. `/dashboard` 이동 → 통계 카드 4개, 하단 카드 2개 확인
6. `npm run build` → 빌드 에러 없음 확인
7. 모바일 뷰 (375px): 반응형 레이아웃 확인
