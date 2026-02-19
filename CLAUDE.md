# Vue Playground - Claude 코딩 가이드

이 문서는 Claude가 이 프로젝트에서 코드를 작성할 때 반드시 따라야 할 규칙이다.

---

## 기술 스택

| 역할 | 기술 |
|------|------|
| 프레임워크 | Vue 3 (Composition API, `<script setup>`) |
| 언어 | TypeScript 5.x |
| 빌드 | Vite 7.x |
| 상태 관리 | Pinia (Setup Store 방식) |
| 라우터 | Vue Router 4.x |
| CSS | Tailwind CSS 4.x |
| 테스트 | Vitest + @vue/test-utils |
| 린터 | ESLint 10.x (flat config) |
| 포매터 | Prettier 3.x |

---

## 1. Vue 컴포넌트 작성 규칙

### 반드시 `<script setup lang="ts">` 사용
```vue
<!-- 올바른 방식 -->
<script setup lang="ts">
const props = defineProps<{ title: string }>()
</script>

<!-- 금지: Options API -->
<script>
export default { ... }
</script>
```

### `defineProps` / `defineEmits`는 타입 기반으로 선언
```vue
<script setup lang="ts">
const props = defineProps<{
  title: string
  count?: number
}>()

const emit = defineEmits<{
  change: [value: number]
  close: []
}>()
</script>
```

### 컴포넌트 순서: `defineOptions` → `defineProps` → `defineEmits` → 로직
```vue
<script setup lang="ts">
defineOptions({ name: 'MyComponent' })
const props = defineProps<{ ... }>()
const emit = defineEmits<{ ... }>()

// 로직
const count = ref(0)
</script>
```

### 템플릿 규칙
- 이벤트 핸들러: `@click` (v-on 약어 사용)
- 바인딩: `:prop` (v-bind 약어 사용)
- 조건: `v-if` / `v-else-if` / `v-else`
- 반복: `v-for`에 반드시 `:key` 지정
- `v-if`와 `v-for`는 같은 요소에 사용 금지

---

## 2. TypeScript 규칙

### `any` 사용 금지 — 대신 `unknown` 또는 구체적인 타입 사용
```typescript
// 금지
function process(data: any) { ... }

// 올바른 방식
function process(data: unknown) { ... }
function process(data: UserData) { ... }
```

### 타입 import는 `import type` 사용
```typescript
import type { User } from '@/types/user'
```

### 타입 정의는 `src/types/` 디렉토리에 모음
```typescript
// src/types/user.ts
export interface User {
  id: number
  name: string
  email: string
}
```

### 함수 반환 타입 명시 (public API)
```typescript
function formatDate(date: Date): string {
  return date.toISOString()
}
```

---

## 3. Pinia 스토어 규칙

### Setup Store 방식만 사용 (Options Store 금지)
```typescript
// 올바른 방식: Setup Store
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const isLoggedIn = computed(() => user.value !== null)

  async function fetchUser(id: number) {
    user.value = await api.getUser(id)
  }

  return { user, isLoggedIn, fetchUser }
})

// 금지: Options Store
export const useUserStore = defineStore('user', {
  state: () => ({ ... }),
})
```

### 스토어 파일명: `camelCase.ts` (예: `userProfile.ts`)

---

## 4. Composables 규칙

### `use` 접두사 필수, `src/composables/` 디렉토리에 위치
```typescript
// src/composables/useLocalStorage.ts
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const value = ref<T>(defaultValue)
  // ...
  return { value }
}
```

### 컴포저블은 단일 책임 원칙을 따름 (하나의 기능만 담당)

---

## 5. 파일 및 디렉토리 규칙

```
src/
├── assets/        # 정적 리소스 (이미지, 폰트)
├── components/    # 재사용 UI 컴포넌트 (PascalCase.vue)
├── composables/   # Composition API 훅 (useXxx.ts)
├── layouts/       # 레이아웃 컴포넌트 (XxxLayout.vue)
├── pages/         # 라우트 페이지 (XxxPage.vue)
├── router/        # 라우터 설정
├── stores/        # Pinia 스토어 (useXxxStore.ts)
├── types/         # TypeScript 타입 정의
└── utils/         # 순수 유틸리티 함수
```

### 네이밍 규칙
| 항목 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `UserCard.vue` |
| 페이지 파일 | PascalCase + Page | `UserProfilePage.vue` |
| 레이아웃 파일 | PascalCase + Layout | `DefaultLayout.vue` |
| Composable | camelCase + use | `useLocalStorage.ts` |
| Store | camelCase | `userProfile.ts` |
| 타입/인터페이스 | PascalCase | `interface UserProfile` |
| 유틸 함수 | camelCase | `formatDate.ts` |
| CSS 클래스 | Tailwind 유틸리티 클래스 사용 |

---

## 6. 경로 alias

`@/`는 `src/`를 가리킨다. 상대 경로 대신 항상 alias 사용.

```typescript
// 금지
import Button from '../../../components/Button.vue'

// 올바른 방식
import Button from '@/components/Button.vue'
```

---

## 7. CSS / Tailwind 규칙

- 스타일은 Tailwind 유틸리티 클래스 우선 사용
- 컴포넌트 고유 스타일만 `<style scoped>` 사용
- 전역 CSS는 `src/assets/main.css`에만 작성
- 매직 넘버 대신 Tailwind 토큰 사용 (`p-4` > `padding: 16px`)

---

## 8. 테스트 규칙

- 모든 Pinia 스토어는 단위 테스트 필수
- 테스트 파일: 테스트 대상 파일과 같은 위치, `.test.ts` 확장자
- `describe` → `it` 구조 사용
- 테스트 설명은 한국어로 작성 (행동 중심)

```typescript
describe('useCounterStore', () => {
  it('초기값은 0이다', () => { ... })
  it('increment 호출 시 count가 1 증가한다', () => { ... })
})
```

---

## 9. 코드 품질 원칙

### 함수
- 함수 하나는 한 가지 일만 한다
- 함수 길이는 30줄 이하로 유지
- 3개 이상의 매개변수는 객체로 묶기

```typescript
// 금지
function createUser(name: string, age: number, email: string, role: string) { ... }

// 올바른 방식
interface CreateUserParams {
  name: string
  age: number
  email: string
  role: string
}
function createUser(params: CreateUserParams) { ... }
```

### 변수명
- 의도가 드러나는 이름 사용
- boolean 변수: `is`, `has`, `can` 접두사

```typescript
// 금지
const d = new Date()
const flag = true

// 올바른 방식
const createdAt = new Date()
const isLoggedIn = true
```

### 주석
- 코드가 왜(why) 이렇게 작성됐는지만 주석으로 설명
- 무엇(what)을 하는지는 코드 자체로 표현

```typescript
// 금지: 무엇을 하는지 설명하는 주석
// count를 1 증가시킨다
count.value++

// 올바른 방식: 왜 이렇게 하는지 설명
// API 호출 실패 시 낙관적 업데이트를 롤백하기 위해 원래 값을 보존
const previousCount = count.value
```

---

## 10. 금지 사항

- `any` 타입 사용
- Options API 사용
- `v-if` + `v-for` 동일 요소 사용
- `console.log` 커밋 (디버깅 용도 이후 반드시 제거)
- 상대 경로 import (`../../`)
- `eslint-disable` 무분별한 사용
- 타입 단언(`as Type`) 남용 — 불가피한 경우 주석으로 이유 설명
