# Next.js 16 스타터킷 구현 계획 v2

> 초보자도 이해할 수 있도록 5단계로 구성한 스타터킷 제작 가이드입니다.

---

## 들어가기 전에 — RSC란?

Next.js 13부터 도입된 **React Server Components(RSC)** 개념을 먼저 이해해야 합니다.

### Server Component vs Client Component

| 구분 | Server Component (기본값) | Client Component |
|------|--------------------------|-----------------|
| 선언 방법 | 아무것도 안 씀 | 파일 맨 위에 `'use client'` 작성 |
| 실행 위치 | 서버 | 브라우저 |
| `useState`, `useEffect` | 사용 불가 | 사용 가능 |
| 클릭·입력 이벤트 핸들러 | 사용 불가 | 사용 가능 |
| DB·파일 직접 접근 | 가능 | 불가 |
| JS 번들 크기 영향 | 없음 (브라우저에 안 보냄) | 있음 |

```tsx
// ✅ Server Component — 파일 상단에 아무것도 없음
export default async function Page() {
  const data = await fetch('https://api.example.com/posts') // 서버에서 직접 fetch 가능
  return <div>{data.title}</div>
}
```

```tsx
// ✅ Client Component — 'use client' 필수
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0) // useState 사용 가능
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

> **원칙**: 기본은 Server Component, `useState`/`useEffect`/이벤트 핸들러가 필요할 때만 `'use client'`를 붙입니다.

---

## 1단계 — 프로젝트 구조 구성

### 무엇을 하는가?
앞으로 만들 파일들이 어디에 위치할지 폴더 구조를 미리 정합니다.

### 왜 필요한가?
폴더 구조를 처음부터 잘 잡아두면 파일이 수십 개로 늘어나도 어디를 수정해야 할지 바로 찾을 수 있습니다. 반대로 처음에 아무 곳에나 파일을 두면 나중에 정리하기가 매우 힘들어집니다.

### 최종 폴더 구조

```
src/
├── app/                      → 페이지 파일 모음 (URL 경로와 1:1 대응)
│   ├── layout.tsx            → 모든 페이지를 감싸는 공통 틀 (헤더·푸터 포함)
│   ├── page.tsx              → 메인 페이지 (/)
│   ├── globals.css           → 전역 스타일 (색상 변수, 다크모드 등)
│   └── dashboard/
│       └── page.tsx          → 대시보드 페이지 (/dashboard)
│
├── components/
│   ├── ui/                   → 재사용 가능한 작은 UI 조각들 (버튼, 카드 등)
│   │   ├── button.tsx        → (기존) 버튼
│   │   ├── card.tsx          → 카드 컨테이너
│   │   ├── badge.tsx         → 뱃지 (태그 표시용)
│   │   ├── input.tsx         → 입력 필드
│   │   ├── label.tsx         → 입력 필드 라벨
│   │   ├── separator.tsx     → 구분선
│   │   └── avatar.tsx        → 프로필 이미지
│   │
│   └── layout/               → 페이지 뼈대를 구성하는 컴포넌트
│       ├── header.tsx        → 상단 헤더 (로고 + 메뉴 + 다크모드 버튼)
│       ├── footer.tsx        → 하단 푸터
│       └── theme-toggle.tsx  → 다크/라이트 전환 버튼
│
├── hooks/                    → 여러 곳에서 공통으로 쓰는 기능 묶음
│   ├── use-local-storage.ts  → 브라우저 저장소(localStorage) 훅
│   ├── use-media-query.ts    → 화면 크기 감지 훅
│   └── use-theme.ts          → 테마(다크/라이트) 관리 훅
│
├── lib/                      → 도우미 함수들
│   └── utils.ts              → (기존) cn() - 클래스명 합치기 함수
│
└── config/
    └── site.ts               → 사이트 이름, 메뉴 목록 등 설정값
```

### 핵심 개념: `app/` 폴더 = URL 주소
Next.js App Router에서는 **폴더가 곧 URL 주소**입니다.

```
app/page.tsx              →  /          (메인 페이지)
app/dashboard/page.tsx    →  /dashboard (대시보드)
app/blog/[id]/page.tsx    →  /blog/123  (동적 경로)
```

새 페이지를 추가하려면 폴더를 만들고 그 안에 `page.tsx`를 넣으면 됩니다.

---

## 2단계 — 레이아웃 컴포넌트 생성

### 무엇을 하는가?
모든 페이지에 공통으로 들어가는 **헤더**, **푸터**, **다크모드 토글**을 만들고, `layout.tsx`에 연결합니다.

### 왜 필요한가?
헤더를 모든 페이지마다 따로 붙이면 메뉴 항목 하나를 수정할 때 페이지 수만큼 파일을 고쳐야 합니다. `layout.tsx`에 한 번만 넣으면 모든 페이지에 자동 적용됩니다.

### 만드는 파일들

#### `src/config/site.ts` (신규)
사이트 이름, 설명, 메뉴 목록을 **한 곳**에서 관리합니다. 코드 안에 직접 문자열을 쓰지(하드코딩) 않기 위해 별도 파일로 분리합니다.

```ts
export const siteConfig = {
  name: "NextStarter",
  description: "Next.js 16 스타터킷",
  nav: [
    { title: "홈", href: "/" },
    { title: "대시보드", href: "/dashboard" },
  ],
}
```

#### `src/components/layout/header.tsx` (신규, Server Component)
로고 + 네비게이션 메뉴 + 다크모드 버튼. `siteConfig.nav`를 읽어 메뉴를 자동 생성합니다.

#### `src/components/layout/footer.tsx` (신규, Server Component)
하단 링크 모음 + 저작권 표시.

#### `src/components/layout/theme-toggle.tsx` (신규, **Client Component**)
클릭하면 다크/라이트 모드가 전환되는 버튼. **클릭 이벤트가 있으니 `'use client'` 필수.**

#### `src/components/providers.tsx` (신규, Client Component)
테마 상태를 전체 앱에 적용하는 래퍼 컴포넌트.

#### `src/app/layout.tsx` (수정)
아래 구조로 수정합니다:

```tsx
// layout.tsx 구조
<html lang="ko" suppressHydrationWarning>
  <head>
    {/* 다크모드 깜빡임 방지 스크립트 */}
    <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
  </head>
  <body>
    <Providers>
      <Header />          {/* 모든 페이지 위에 헤더 */}
      <main>{children}</main>  {/* 각 페이지 내용 */}
      <Footer />          {/* 모든 페이지 아래에 푸터 */}
    </Providers>
  </body>
</html>
```

> **`suppressHydrationWarning`이란?** 서버가 HTML을 만들 때와 브라우저가 React를 초기화할 때 다크모드 클래스가 달라서 생기는 경고를 억제합니다.

> **테마 깜빡임(Flash) 문제**: 페이지가 처음 로드될 때 잠깐 흰 화면이 보이다가 다크모드로 바뀌는 현상이 있습니다. `<script>`로 페인팅 전에 `.dark` 클래스를 미리 붙여 해결합니다.

---

## 3단계 — 메인 페이지 구성

### 무엇을 하는가?
사이트 첫 화면(`/`)을 실제 서비스에 쓸 수 있는 **랜딩 페이지**로 교체합니다.

### 왜 필요한가?
Create Next App으로 만든 기본 페이지는 Next.js 홍보용 페이지입니다. 실제 프로젝트를 시작하려면 이 페이지를 갈아엎어야 합니다.

### 수정 파일: `src/app/page.tsx` 전면 교체

#### 페이지 구성

**① 히어로 섹션** (페이지 최상단, 가장 눈에 띄는 영역)
```
[뱃지: Next.js 16 + React 19]

모던 웹 개발의
완벽한 시작점

한 줄 설명 텍스트

[시작하기 →]  [GitHub]
```

**② 기능 소개 카드 3개** (3열 그리드)
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ ⚡ 빠른 시작  │  │ 🛡 타입 안전 │  │ 🎨 모던 UI  │
│ [성능]       │  │ [TypeScript] │  │ [ShadcnUI]  │
│ 제목         │  │ 제목         │  │ 제목        │
│ 설명 텍스트   │  │ 설명 텍스트   │  │ 설명 텍스트  │
└─────────────┘  └─────────────┘  └─────────────┘
```

**③ 하단 CTA 섹션**
```
지금 바로 시작하세요.

[대시보드 보기]
```

> **`async` 없이도 되나요?** 이 페이지는 외부 API나 DB에서 데이터를 가져오지 않으므로 일반 함수로 작성합니다. 데이터 fetching이 필요한 페이지라면 `async function Page()` 로 바꾸면 됩니다.

---

## 4단계 — 예제 페이지들 생성

### 무엇을 하는가?
실제 프로젝트에서 자주 쓰이는 페이지 패턴의 예시를 만듭니다.

### 왜 필요한가?
스타터킷을 받고 나서 "대시보드는 어떻게 만들지?" 고민하지 않도록, 바로 참고하고 수정해서 쓸 수 있는 예시 페이지를 제공합니다.

### 만드는 파일: `src/app/dashboard/page.tsx` (신규)

> **파일을 만들면 URL이 생긴다**: `app/dashboard/page.tsx` 파일을 만드는 순간 `/dashboard` 주소가 자동으로 생깁니다. 별도 라우팅 설정 불필요.

#### 페이지 구성

**① 페이지 메타데이터**
```tsx
export const metadata = { title: "대시보드" }
// 브라우저 탭에 "대시보드 | NextStarter" 로 자동 표시됨
```

**② 통계 카드 4개** (모바일 1열 → 태블릿 2열 → PC 4열 반응형)
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 총 방문자  │ │이번달 수익│ │ 활성 사용자│ │  전환율   │
│ 👥       │ │ 💰       │ │ 📈       │ │ 📊       │
│ 12,345   │ │ ₩2,345K  │ │ 1,234   │ │ 3.4%    │
│ +12%     │ │ +5.2%    │ │ +8%     │ │ -0.2%   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**③ 하단 2열 카드**
```
┌───────────────────┐  ┌───────────────────┐
│    최근 활동       │  │    팀 멤버         │
│                   │  │                   │
│ 🔵 홍길동 가입     │  │ [👤] 홍길동  관리자 │
│ 🟢 주문 #1234 완료 │  │ [👤] 김철수  개발자 │
│ 🔴 결제 실패       │  │ [👤] 이영희  디자이너│
└───────────────────┘  └───────────────────┘
```

---

## 5단계 — 유틸리티 기능 추가

### 무엇을 하는가?
여러 컴포넌트에서 공통으로 필요한 기능들을 **훅**과 **UI 컴포넌트**로 만듭니다.

### 왜 필요한가?
같은 코드를 여러 파일에 복붙하면 버그를 고칠 때 모든 파일을 찾아다녀야 합니다. 한 곳에 모아두면 한 번만 고치면 됩니다.

### 커스텀 훅이란?
`use`로 시작하는 함수로, `useState`/`useEffect` 등 React 훅을 묶어서 재사용 가능한 기능 단위로 만든 것입니다.

```ts
// ❌ 매 컴포넌트마다 같은 코드 반복
const [value, setValue] = useState(...)
useEffect(() => { localStorage.setItem(...) }, [value])

// ✅ 커스텀 훅으로 한 번만 작성
const [value, setValue] = useLocalStorage('key', defaultValue)
```

### 만드는 훅들

#### `src/hooks/use-local-storage.ts` (신규, Client)
브라우저의 localStorage를 `useState`처럼 쓸 수 있게 해줍니다. 테마 설정 저장에 사용됩니다.

```ts
// 사용 예시
const [theme, setTheme] = useLocalStorage('theme', 'system')
// → 새로고침해도 저장된 값이 유지됨
```

#### `src/hooks/use-media-query.ts` (신규, Client)
CSS 미디어 쿼리를 JavaScript에서 감지합니다.

```ts
// 사용 예시
const isMobile = useMediaQuery('(max-width: 768px)')
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
```

#### `src/hooks/use-theme.ts` (신규, Client)
위 두 훅을 조합해 다크/라이트/시스템 테마를 관리합니다.

```ts
// 사용 예시
const { theme, resolvedTheme, setTheme } = useTheme()
// theme: 'system' | 'light' | 'dark' (사용자 선택)
// resolvedTheme: 'light' | 'dark' (실제 적용값)
```

### 만드는 ShadcnUI 컴포넌트들

ShadcnUI는 "복사해서 내 프로젝트에 붙여넣는" 방식의 UI 라이브러리입니다. `node_modules`에 설치되는 게 아니라 내 코드로 직접 가져옵니다.

| 파일 | 용도 | Client 여부 |
|------|------|------------|
| `src/components/ui/card.tsx` | 콘텐츠를 감싸는 카드 박스 | Server |
| `src/components/ui/badge.tsx` | 태그·상태 표시용 뱃지 | Server |
| `src/components/ui/input.tsx` | 텍스트 입력 필드 | Server |
| `src/components/ui/label.tsx` | 입력 필드 라벨 | Client (Radix UI) |
| `src/components/ui/separator.tsx` | 수평/수직 구분선 | Client (Radix UI) |
| `src/components/ui/avatar.tsx` | 프로필 이미지 (이미지 없으면 이니셜 표시) | Client (Radix UI) |

> **왜 일부는 Client인가?** Radix UI 라이브러리를 사용하는 컴포넌트는 내부적으로 React Context를 사용하기 때문에 Client Component여야 합니다.

---

## 검증 방법

```bash
npm run dev   # 개발 서버 시작
```

1. `http://localhost:3000` → 히어로 섹션, 기능 카드 3개, CTA 버튼 확인
2. 헤더의 달/해 버튼 클릭 → 다크/라이트 전환 확인
3. 페이지 새로고침 → 선택한 테마 유지 확인 (localStorage에 저장됨)
4. `/dashboard` 접속 → 통계 카드 4개, 최근 활동·팀 멤버 카드 확인
5. 브라우저 창 크기 줄이기 → 반응형 레이아웃 확인

```bash
npm run build   # 최종 빌드 에러 없음 확인
```
