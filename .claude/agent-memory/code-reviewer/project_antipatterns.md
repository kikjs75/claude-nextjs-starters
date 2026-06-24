---
name: project_antipatterns
description: 이 프로젝트에서 반복적으로 발견된 안티패턴 목록
metadata:
  type: project
---

## 발견된 안티패턴 (2026-06-24 초기 리뷰 기준)

1. **table.tsx에 불필요한 `use client`**: Radix UI를 사용하지 않는 순수 HTML 테이블 컴포넌트임에도 `use client` 지시어가 있음. RSC로 전환 가능.

2. **DataTable URL/내부 상태 불일치**: `search`는 nuqs URL 상태, `columnFilters`는 `useState`로 이중 관리. 초기 로드 시 URL의 `q` 파라미터가 `columnFilters`에 반영되지 않아 데이터가 필터링되지 않는 버그 존재.

3. **examples/page.tsx 깨진 링크**: `/examples/components`, `/examples/forms`, `/examples/layouts`, `/examples/hooks`, `/examples/data-fetching` 페이지가 존재하지 않음 (git에서 삭제됨). 404 발생.

4. **optimization/page.tsx Metadata 타입 미임포트**: `Metadata` 타입을 `next`에서 임포트하지 않고 사용 (TypeScript 오류 또는 암묵적 any).

5. **ReactQueryDevtools 프로덕션 포함**: `providers.tsx`에서 개발 도구가 프로덕션에서도 번들에 포함됨.

6. **ThemeToggle 하이드레이션 이슈**: `resolvedTheme` 사용 시 서버/클라이언트 불일치 가능성. `useEffect` + `mounted` 패턴 미적용.

7. **sidebar.tsx 하드코딩된 버전**: "NextStarter v3" 문자열이 하드코딩. `siteConfig`나 `package.json`에서 관리해야 함.

8. **privacy/terms 페이지의 prose 클래스**: `@tailwindcss/typography` 패키지 없이 `prose` 클래스 사용.

**Why:** 스타터킷으로서 예제 코드가 삭제되면서 링크가 깨졌고, 일부 구현이 미완성 상태임.

**How to apply:** 초기 리뷰 시 위 항목들을 우선 확인할 것.
