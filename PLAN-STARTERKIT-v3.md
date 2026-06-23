# Next.js 16 스타터킷 구현 계획 v3

> v2에서 나온 계획을 심화한 버전입니다.
> 컴포넌트 계층 체계화 + 우선순위 기반 설치 + 검증된 라이브러리 채택.

---

## 핵심 설계 원칙

### 1. 바퀴를 재발명하지 마라
직접 만들 수 있어도, 이미 수백만 명이 검증한 라이브러리가 있다면 그것을 씁니다.

| 목적 | ❌ 직접 구현 (v2 방식) | ✅ 라이브러리 채택 (v3) |
|------|----------------------|----------------------|
| 다크모드 | `use-theme.ts` 직접 작성 | **`next-themes`** |
| Toast 알림 | 커스텀 Toast 컴포넌트 | **`sonner`** |
| 폼 상태 관리 | `useState`로 직접 관리 | **`react-hook-form`** |
| 스키마 검증 | 직접 조건문 작성 | **`zod`** |
| 미디어 쿼리 | `use-media-query.ts` 직접 작성 | **`usehooks-ts`** |
| localStorage | `use-local-storage.ts` 직접 작성 | **`usehooks-ts`** |
| DataTable (정렬/페이징/필터) | 수백 줄 직접 구현 | **`@tanstack/react-table`** |
| 클라이언트 데이터 페칭 | `useState + useEffect + fetch` | **`@tanstack/react-query`** |
| URL 쿼리 상태 관리 | `useSearchParams + router.push` | **`nuqs`** |

### 2. 컴포넌트를 계층으로 생각하라
작은 것부터 쌓아 올립니다. 큰 것을 먼저 만들려 하지 않습니다.

### 3. 우선순위(P0→P1→P2)에 따라 단계적으로 설치
없으면 아예 시작이 안 되는 것 → 대부분의 앱에서 필요한 것 → 예제로 보여줄 것 순서로.

---

## 채택 라이브러리 상세

### `next-themes` — 다크모드 관리
- **왜?**: SSR hydration 처리, flash 방지, 시스템 테마 감지를 모두 내장. 직접 만들면 edge case가 많음.
- **설치**: `npm install next-themes`
- **사용법**:
  ```tsx
  // providers.tsx
  import { ThemeProvider } from 'next-themes'
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    {children}
  </ThemeProvider>

  // theme-toggle.tsx
  import { useTheme } from 'next-themes'
  const { theme, setTheme } = useTheme()
  ```

### `sonner` — Toast 알림
- **왜?**: shadcn 공식 통합 패키지. 단 두 줄로 어디서든 알림 표시 가능.
- **설치**: `npx shadcn add sonner`
- **사용법**:
  ```tsx
  // layout.tsx에 <Toaster /> 한 번 추가
  import { toast } from 'sonner'
  toast.success('저장되었습니다!')
  toast.error('오류가 발생했습니다.')
  ```

### `react-hook-form` + `zod` — 폼 관리
- **왜?**: 폼은 직접 관리하면 코드가 폭발적으로 늘어남. 이 조합이 React 폼의 사실상 표준.
- **설치**: `npm install react-hook-form zod @hookform/resolvers`
- **사용법**:
  ```tsx
  const schema = z.object({ email: z.string().email() })
  const form = useForm({ resolver: zodResolver(schema) })
  ```

### `@tanstack/react-table` — DataTable
- **왜?**: 테이블 정렬·페이징·필터링을 직접 구현하면 수백 줄. shadcn 공식 DataTable 예시도 이 라이브러리 기반.
- **설치**: `npm install @tanstack/react-table`
- **구조**: headless 라이브러리 → shadcn `Table` UI + TanStack 로직 분리
- **사용법**:
  ```tsx
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel(),
    getSortedRowModel(),   // 정렬
    getPaginationRowModel(), // 페이징
    getFilteredRowModel(),  // 필터링
  })
  ```
- **생성 파일**: `src/components/ui/data-table.tsx` (P2)

### `@tanstack/react-query` — 클라이언트 데이터 페칭
- **왜?**: 직접 구현하면 로딩/에러/캐싱/재검증을 모두 처리해야 함. RSC의 `fetch`가 기본이지만, 실시간 업데이트·낙관적 업데이트가 필요한 클라이언트 컴포넌트에서 표준.
- **설치**: `npm install @tanstack/react-query @tanstack/react-query-devtools`
- **사용법**:
  ```tsx
  // providers.tsx에 QueryClientProvider 추가
  const { data, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: () => fetch('/api/stats').then(r => r.json()),
  })
  ```
- **역할 분리**:
  - RSC에서 초기 데이터 → Next.js `fetch` (캐싱 내장)
  - Client Component에서 실시간/인터랙티브 데이터 → react-query

### `nuqs` — URL 쿼리 상태 관리
- **왜?**: `useSearchParams` + `router.push`를 조합해 URL 상태를 관리하면 타입 안전성이 없고 코드가 복잡해짐. `nuqs`는 `useState`와 동일한 API로 URL 상태를 관리.
- **설치**: `npm install nuqs`
- **사용법**:
  ```tsx
  // DataTable의 페이징/필터링을 URL에 반영
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [search, setSearch] = useQueryState('q', { defaultValue: '' })
  // 결과: /dashboard?page=2&q=홍길동 → 새로고침해도 상태 유지
  ```

### `usehooks-ts` — 범용 훅 모음
- **왜?**: `useMediaQuery`와 `useLocalStorage`를 직접 구현하면 SSR 이슈, hydration 불일치 등 edge case가 많음. `react-responsive`는 `prop-types` 의존성이 있어 React 19(deprecated)에 맞지 않음.
- **비교**:

  | | `react-responsive` | `use-local-storage-state` | **`usehooks-ts`** |
  |--|-------------------|--------------------------|------------------|
  | 번들 크기 | 56KB | 17KB | 250KB (tree-shaking으로 쓰는 것만 포함) |
  | 의존성 | **4개** (prop-types 포함) | 없음 | 없음 |
  | 제공 기능 | useMediaQuery만 | useLocalStorage만 | **둘 다 + 20개 훅** |
  | React 19 호환 | ⚠️ prop-types deprecated | ✅ | ✅ |

- **설치**: `npm install usehooks-ts`
- **사용법**:
  ```tsx
  import { useMediaQuery, useLocalStorage } from 'usehooks-ts'

  // 모바일 여부 감지
  const isMobile = useMediaQuery('(max-width: 768px)')

  // localStorage를 useState처럼 사용
  const [theme, setTheme] = useLocalStorage('theme', 'system')

  // 추가로 쓸 수 있는 훅들
  // useDebounce — 검색 입력 딜레이
  // useToggle   — boolean 토글
  // useIsClient — SSR 여부 감지
  // useWindowSize — 창 크기
  ```

---

## 컴포넌트 계층 구조

어디서든 웹 서비스를 만들 때 필요한 컴포넌트를 5개 계층으로 분류합니다.

```
┌─────────────────────────────────────────────────────────┐
│ Layer 5 — Pages (페이지)                                 │
│   Landing(/) · Dashboard(/dashboard) · NotFound(404)    │
├─────────────────────────────────────────────────────────┤
│ Layer 4 — Layout (레이아웃, 페이지 뼈대)                  │
│   Header · Footer · Sidebar · PageContainer             │
├─────────────────────────────────────────────────────────┤
│ Layer 3 — Organisms (유기체, 기능을 가진 단위)             │
│   Form · DataTable · DropdownMenu · Sheet · CommandPalette│
├─────────────────────────────────────────────────────────┤
│ Layer 2 — Molecules (분자, 원자들의 조합)                  │
│   Card · Alert · Toast · Tooltip · Select · Dialog      │
├─────────────────────────────────────────────────────────┤
│ Layer 1 — Atoms (원자, 더 이상 쪼갤 수 없는 단위)          │
│   Button · Input · Label · Badge · Avatar               │
│   Separator · Skeleton · Switch · Checkbox              │
└─────────────────────────────────────────────────────────┘
         ↑ 아래에서 위로 쌓아 올립니다
```

### 왜 계층이 중요한가?
- **재사용성**: `Input` + `Label` + `Button` → `LoginForm` (원자로 유기체를 만듦)
- **수정 용이성**: `Button` 색상을 바꾸면 그것을 쓰는 모든 곳이 일괄 변경됨
- **개발 순서**: 아래 계층부터 만들어야 위 계층을 만들 수 있음

---

## 우선순위별 설치 목록

### P0 — 없으면 스타터킷 자체가 불가능

**외부 라이브러리 설치:**
```bash
npm install next-themes sonner react-hook-form zod @hookform/resolvers
```

**shadcn 컴포넌트 설치:**
```bash
npx shadcn add card badge input label separator avatar skeleton sonner
```

**직접 만드는 파일:**
| 파일 | 설명 |
|------|------|
| `src/config/site.ts` | 사이트 이름, 메뉴 등 전역 설정 |
| `src/components/providers.tsx` | ThemeProvider(next-themes) 래퍼 |
| `src/components/layout/header.tsx` | 로고 + 데스크탑 Nav + 모바일 Nav(Sheet) + ThemeToggle |
| `src/components/layout/footer.tsx` | 링크 + 저작권 |
| `src/components/layout/theme-toggle.tsx` | next-themes의 useTheme 사용 |
| `src/app/layout.tsx` | 수정: ThemeProvider + Header + Footer + Toaster 연결 |

### P1 — 대부분의 실제 앱에서 필요

**shadcn 컴포넌트 설치:**
```bash
npx shadcn add dialog dropdown-menu select tabs tooltip alert sheet
```

**직접 만드는 파일:**
| 파일 | 설명 |
|------|------|
| `src/components/layout/sidebar.tsx` | 대시보드용 사이드바 |
| `src/app/dashboard/layout.tsx` | Sidebar + 메인 영역 레이아웃 |

### P2 — 예제로 사용 패턴을 보여주는 용도

**shadcn 컴포넌트 설치:**
```bash
npx shadcn add table form command accordion scroll-area
```

**직접 만드는 파일:**
| 파일 | 설명 |
|------|------|
| `src/app/page.tsx` | 랜딩 페이지 교체 |
| `src/app/dashboard/page.tsx` | 대시보드 예시 (react-query + nuqs 사용 패턴 포함) |
| `src/components/ui/data-table.tsx` | @tanstack/react-table + shadcn Table 조합 |

---

## 레이아웃 구조 설계

### Public 레이아웃 (랜딩, 소개 페이지)
```
app/layout.tsx
└── ThemeProvider (next-themes)
    ├── Header
    │   ├── Logo (Link 컴포넌트)
    │   ├── DesktopNav (hidden md:flex) ← PC에서만 보임
    │   ├── MobileNav (Sheet 사용, md:hidden) ← 모바일에서만 보임
    │   │   └── 햄버거 버튼 → 슬라이드 사이드 메뉴
    │   └── ThemeToggle (Sun/Moon 아이콘 버튼)
    ├── <main>{children}</main>
    ├── Footer
    └── <Toaster /> (sonner, 알림이 표시되는 곳)
```

### App 레이아웃 (대시보드, 로그인 후)
```
app/dashboard/layout.tsx
├── Sidebar
│   ├── Logo
│   ├── SidebarNav (아이콘 + 메뉴명 목록)
│   └── SidebarUser (아바타 + 이름 + 드롭다운)
└── 우측 영역
    ├── DashboardHeader (페이지 제목 + 액션 버튼)
    └── <main>{children}</main>
```

---

## 1단계 — 프로젝트 구조 구성

### 무엇을 하는가?
전체 폴더 구조를 확정하고, 컴포넌트 계층 개념과 RSC 개념을 정리합니다.

### 최종 폴더 구조
```
src/
├── app/
│   ├── layout.tsx            → 루트 레이아웃 (ThemeProvider + Header + Footer)
│   ├── page.tsx              → 랜딩 페이지 (/)
│   ├── globals.css           → 전역 스타일
│   └── dashboard/
│       ├── layout.tsx        → 대시보드 레이아웃 (Sidebar + Main)
│       └── page.tsx          → 대시보드 페이지 (/dashboard)
│
├── components/
│   ├── ui/                   → Layer 1~3: shadcn 컴포넌트들
│   │   ├── button.tsx        → (기존)
│   │   ├── card.tsx          → P0
│   │   ├── badge.tsx         → P0
│   │   ├── input.tsx         → P0
│   │   ├── label.tsx         → P0
│   │   ├── separator.tsx     → P0
│   │   ├── avatar.tsx        → P0
│   │   ├── skeleton.tsx      → P0 (로딩 상태)
│   │   ├── sonner.tsx        → P0 (toast)
│   │   ├── dialog.tsx        → P1
│   │   ├── dropdown-menu.tsx → P1
│   │   ├── select.tsx        → P1
│   │   ├── tabs.tsx          → P1
│   │   ├── tooltip.tsx       → P1
│   │   ├── alert.tsx         → P1
│   │   ├── sheet.tsx         → P1 (모바일 Nav, 슬라이드 패널)
│   │   ├── table.tsx         → P2
│   │   ├── form.tsx          → P2 (react-hook-form 연동)
│   │   └── ...
│   │
│   ├── layout/               → Layer 4: 레이아웃 컴포넌트
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   └── theme-toggle.tsx
│   │
│   └── providers.tsx         → ThemeProvider (next-themes)
│
├── lib/
│   └── utils.ts              → (기존) cn() 함수
│
├── config/
│   └── site.ts               → 사이트 전역 설정
│
└── hooks/                    → 프로젝트 고유 로직만 (처음엔 비어있음)
    └── (필요 시 추가)          → useMediaQuery/useLocalStorage는 usehooks-ts 사용
```

---

## 2단계 — 레이아웃 컴포넌트 생성

### 무엇을 하는가?
모든 페이지에 공통으로 들어가는 **헤더, 푸터, 사이드바, 다크모드**를 만들고 레이아웃에 연결합니다.

### 왜 `next-themes`를 쓰는가?
직접 다크모드를 구현하면 다음 문제들이 생깁니다:
- **Flash 문제**: 페이지 로드 시 잠깐 흰 화면이 보이다가 다크모드로 바뀜
- **SSR 불일치**: 서버가 만든 HTML과 브라우저 React 초기화 시 dark 클래스가 달라 에러
- **시스템 테마 감지**: `prefers-color-scheme` 미디어 쿼리 처리 복잡

`next-themes`는 이 모든 것을 처리해줍니다.

```tsx
// ✅ next-themes 사용 - 단 3줄
'use client'
import { useTheme } from 'next-themes'
const { setTheme } = useTheme()
```

### 모바일 내비게이션 (Sheet 활용)
PC에서는 헤더에 메뉴를 가로로 나열하고, 모바일에서는 **Sheet**(슬라이드 패널)로 햄버거 메뉴를 만듭니다.

```
PC (md 이상):   [Logo] [홈] [대시보드] [문서]    [🌙]
모바일:         [Logo]                           [≡] [🌙]
                                                  ↓ 클릭 시
                                            ┌─────────┐
                                            │ 홈       │
                                            │ 대시보드  │
                                            │ 문서      │
                                            └─────────┘
```

---

## 3단계 — 메인 페이지 구성

### 무엇을 하는가?
기본 Next.js 홈페이지를 실제 서비스에 쓸 수 있는 **랜딩 페이지**로 교체합니다.

### 페이지 구성
```
┌─────────────────────────────────────────┐
│ [Next.js 16 + React 19]  ← Badge        │
│                                         │
│   모던 웹 개발의                          │
│   완벽한 시작점              ← h1        │
│                                         │
│   설명 텍스트 한 줄                       │
│                                         │
│   [시작하기 →]  [GitHub]  ← Button      │
├─────────────────────────────────────────┤
│ ⚡ 빠른 시작  │ 🛡 타입 안전 │ 🎨 모던 UI │ ← Card 3개
│ [성능] 뱃지  │ [TS] 뱃지   │ [UI] 뱃지  │
│ 제목         │ 제목         │ 제목       │
│ 설명         │ 설명         │ 설명       │
├─────────────────────────────────────────┤
│         지금 바로 시작하세요               │
│           [대시보드 보기]                 │ ← CTA
└─────────────────────────────────────────┘
```

---

## 4단계 — 예제 페이지들 생성

### 무엇을 하는가?
실제 프로젝트에서 가장 자주 만드는 **대시보드 패턴**을 예시로 구현합니다.

### 대시보드 페이지 구성 (`/dashboard`)

**① 통계 카드 4개** (모바일 1열 → PC 4열 반응형)
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 총 방문자  │ │이번달 수익│ │ 활성 사용자│ │  전환율   │
│ 👥 12,345 │ │💰 ₩2.3M  │ │📈 1,234  │ │📊 3.4%  │
│ ↑ +12%   │ │↑ +5.2%  │ │↑ +8%    │ │↓ -0.2%  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**② DataTable** (정렬 + 페이징 + 검색 — @tanstack/react-table + nuqs)
```
[검색: ________]                          [← 1 2 3 →]
──────────────────────────────────────────────────────
이름 ↑    이메일              역할      상태
홍길동    hong@example.com   관리자    [활성]
김철수    kim@example.com    개발자    [비활성]
```
- 검색/페이지 상태는 URL에 반영 → `/dashboard?q=홍&page=2`

**③ react-query 사용 패턴 예시**
```tsx
'use client'
const { data, isLoading } = useQuery({
  queryKey: ['stats'],
  queryFn: fetchStats,
})
// isLoading 중에는 Skeleton 표시
```

**④ Toast 예시 버튼**
```tsx
<Button onClick={() => toast.success('저장되었습니다!')}>
  Toast 테스트
</Button>
```

### 폴더가 곧 URL
```
app/dashboard/page.tsx    →  /dashboard (이 파일을 만들면 URL 자동 생성)
```

---

## 5단계 — 유틸리티 기능 추가

### 무엇을 하는가?
라이브러리들이 제대로 연결되었는지 확인하고, 사용 패턴을 예시 코드로 문서화합니다.

### react-hook-form + zod 폼 예시

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(8, '8자 이상 입력하세요'),
})

// 유효성 검사가 실패하면 자동으로 에러 메시지 표시
// 직접 조건문을 하나하나 작성하지 않아도 됨
```

### Skeleton — 로딩 상태 표시

```tsx
// 데이터를 불러오는 동안 실제 레이아웃과 같은 형태의 로딩 화면 표시
{isLoading ? (
  <Skeleton className="h-32 w-full" />
) : (
  <Card>실제 내용</Card>
)}
```

### 커스텀 훅 — 직접 만들지 않고 `usehooks-ts` 사용

이전에는 `use-mobile.ts`, `use-local-storage.ts`, `use-media-query.ts`를 직접 만들려 했지만, `usehooks-ts` 하나로 모두 대체합니다.

```ts
// ❌ v2 방식: 직접 만들기
// src/hooks/use-media-query.ts — SSR 이슈, hydration 처리 직접 해야 함
// src/hooks/use-local-storage.ts — 직렬화/역직렬화, 에러 처리 직접 해야 함

// ✅ v3 방식: usehooks-ts 사용
import { useMediaQuery, useLocalStorage } from 'usehooks-ts'

const isMobile = useMediaQuery('(max-width: 768px)')       // SSR 안전
const [value, setValue] = useLocalStorage('key', 'default') // 직렬화 자동 처리
```

`src/hooks/` 폴더는 **프로젝트 고유 로직**이 생길 때 만듭니다. 처음부터 만들지 않습니다.

---

## 전체 설치 커맨드 (순서 중요)

```bash
# 1. 외부 라이브러리 설치
npm install next-themes sonner react-hook-form zod @hookform/resolvers usehooks-ts \
  @tanstack/react-table @tanstack/react-query @tanstack/react-query-devtools nuqs

# 2. P0 shadcn 컴포넌트
npx shadcn add card badge input label separator avatar skeleton sonner

# 3. P1 shadcn 컴포넌트
npx shadcn add dialog dropdown-menu select tabs tooltip alert sheet

# 4. P2 shadcn 컴포넌트 (예제용)
npx shadcn add table form command accordion scroll-area
```

---

## 검증 방법

```bash
npm run dev   # 개발 서버 시작
```

| 확인 항목 | 방법 |
|-----------|------|
| 다크모드 전환 | 헤더 Sun/Moon 버튼 클릭 |
| 새로고침 후 테마 유지 | next-themes가 처리 (localStorage 저장) |
| 모바일 메뉴 | 화면 폭을 줄이고 햄버거 버튼 클릭 |
| Toast 알림 | 대시보드 예시 버튼 클릭 |
| 대시보드 Sidebar | `/dashboard` 접속 후 사이드바 확인 |
| DataTable 정렬 | 컬럼 헤더 클릭 → 정렬 아이콘 토글 |
| DataTable 검색 | 검색어 입력 → URL에 `?q=검색어` 반영 확인 |
| DataTable 페이징 | 페이지 버튼 클릭 → URL에 `?page=2` 반영 확인 |
| react-query | 대시보드 로드 시 Skeleton → 데이터 전환 확인 |

```bash
npm run build   # 빌드 에러, 타입 에러 없음 확인

---

## 구현 완료 요약

> 구현 일자: 2026-06-23

### 설치된 라이브러리 (9개)

```bash
npm install next-themes sonner react-hook-form zod @hookform/resolvers \
  usehooks-ts @tanstack/react-table @tanstack/react-query nuqs
```

### 설치된 shadcn 컴포넌트 (19개)

| 우선순위 | 컴포넌트 |
|---------|---------|
| P0 | card, badge, input, label, separator, avatar, skeleton, sonner |
| P1 | dialog, dropdown-menu, select, tabs, tooltip, alert, sheet |
| P2 | table, accordion, scroll-area |

### 생성 / 수정된 파일

| 파일 | 내용 |
|------|------|
| `src/config/site.ts` | 사이트명·nav·footerNav 중앙 설정 |
| `src/components/providers.tsx` | ThemeProvider + QueryClientProvider + NuqsAdapter + TooltipProvider |
| `src/components/layout/theme-toggle.tsx` | next-themes 기반 Sun/Moon 토글 |
| `src/components/layout/header.tsx` | 로고 + 데스크탑 nav + 모바일 Sheet 메뉴 |
| `src/components/layout/footer.tsx` | 링크 + 저작권 |
| `src/components/layout/sidebar.tsx` | 대시보드용 사이드바 (active 상태 포함) |
| `src/app/layout.tsx` | Providers + Header + Footer + Toaster 연결 |
| `src/app/dashboard/layout.tsx` | Sidebar + Suspense 경계 (nuqs useSearchParams 요구사항) |
| `src/app/page.tsx` | 랜딩 페이지 (히어로 + 기능 카드 + 기술스택 뱃지 + CTA) |
| `src/components/ui/data-table.tsx` | TanStack Table + nuqs URL 상태 (정렬·검색·페이징) |
| `src/app/dashboard/page.tsx` | 통계 카드(react-query + Skeleton) + DataTable + Tabs + Toast 예시 |

### 빌드 결과

```
Route (app)
├ ○ /
├ ○ /_not-found
└ ○ /dashboard
○  (Static) prerendered as static content
```

### 주요 트러블슈팅

| 문제 | 원인 | 해결 |
|------|------|------|
| `lucide-react`의 `Github` 아이콘 없음 | lucide-react 1.21에서 이름 변경 | `GitBranch`로 대체 |
| 대시보드 빌드 실패 | nuqs의 `useSearchParams`가 Suspense 경계 요구 | `dashboard/layout.tsx`에 `<Suspense>` 추가 |
```
