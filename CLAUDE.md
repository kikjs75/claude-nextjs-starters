# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 명령어

```bash
npm run dev      # 개발 서버 시작 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
```

테스트 설정 없음.

## 아키텍처 개요

Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS 4 + ShadcnUI(`radix-nova` 스타일) 기반 스타터킷.

### 핵심 설정 파일

**`src/config/site.ts`** — 사이트 전체 설정의 단일 진실 소스. `name`, `description`, `nav`, `dashboardNav`, `footerNav`를 여기서 관리. Header/Footer/Sidebar 모두 이 파일을 참조.

**`src/components/providers.tsx`** — 루트 프로바이더 스택 (클라이언트 컴포넌트):
`ThemeProvider(next-themes)` → `QueryClientProvider(@tanstack/react-query, staleTime 60s)` → `NuqsAdapter(nuqs)` → `TooltipProvider`

### 레이아웃 구조

```
app/layout.tsx          ← 전역 레이아웃 (Providers > Header > main > Footer > Toaster)
app/dashboard/layout.tsx ← 대시보드 레이아웃 (Sidebar + Suspense 포함)
```

### 컴포넌트 구분

- `src/components/ui/` — ShadcnUI 컴포넌트 (기본 RSC, 단 Radix UI 래퍼는 `'use client'`)
- `src/components/layout/` — Header, Footer, Sidebar, ThemeToggle
- `src/app/examples/` — 기능별 예제 페이지 (components, data-fetching, forms, hooks, layouts, optimization)

## 핵심 패턴 및 제약사항

### Tailwind CSS 4
`tailwind.config.js` 없음. 테마 설정은 `src/app/globals.css`의 `@theme inline` 블록에서 관리. 커스텀 색상/변수 추가 시 여기에 작성.

### 다크 모드
`next-themes`가 `<html>` 요소에 `.dark` 클래스를 토글. CSS 다크모드 변형: `@custom-variant dark (&:is(.dark *))`.

### ShadcnUI 컴포넌트
스타일 변형 시 CVA(class-variance-authority) 사용. `data-slot` attribute 패턴 적용.

### Radix UI import
단일 패키지로 임포트:
```ts
import { Avatar, Label, Separator, Slot } from "radix-ui"
```
`@radix-ui/react-*` 개별 패키지 사용 금지.

### RSC 우선 원칙
- 기본값은 서버 컴포넌트(RSC) — `'use client'` 없이 작성
- `'use client'`는 `useState`, `useEffect`, 이벤트 핸들러가 필요한 경우에만 추가
- Radix UI 래퍼 컴포넌트(Label, Avatar, Separator 등)는 클라이언트 컴포넌트

### Path alias
`@/*` → `./src/*`

### ShadcnUI 컴포넌트 추가
```bash
npx shadcn@latest add <component>
```
