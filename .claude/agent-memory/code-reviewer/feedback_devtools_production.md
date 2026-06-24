---
name: feedback_devtools_production
description: ReactQueryDevtools가 프로덕션 빌드에서도 번들에 포함되는 안티패턴
metadata:
  type: feedback
---

ReactQueryDevtools는 프로덕션 환경에서 조건부 렌더링으로 제외해야 한다.

**Why:** `providers.tsx`에서 `ReactQueryDevtools`가 항상 렌더링되고 있어 프로덕션 번들 크기가 불필요하게 증가한다.

**How to apply:** `process.env.NODE_ENV === 'development'` 조건을 추가하거나, Next.js의 동적 임포트(`dynamic`)로 개발 환경에서만 로드한다.

```tsx
{process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
```
