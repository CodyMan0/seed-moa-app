# FSD Architecture Refactoring

## 📁 새로운 폴더 구조

```
src/
├── app/           # 애플리케이션 레이어 (앱 초기화, 프로바이더)
├── widgets/       # 복잡한 UI 블록 (features + entities 조합)
├── features/      # 비즈니스 기능 (CUD 작업)
├── entities/      # 비즈니스 엔티티 (Read 전용)
└── shared/        # 공유 리소스
    ├── api/       # API 클라이언트, 데이터베이스
    ├── ui/        # UI 컴포넌트
    ├── lib/       # 유틸리티 함수
    └── config/    # 설정, 상수

app/               # 기존 Expo Router 구조 (점진적 마이그레이션)
shared/            # 기존 shared 폴더 (점진적 마이그레이션)
```

## 🔄 리팩토링 완료 항목

### 1. Entities Layer (Read 전용)

- ✅ **subscription entity**
  - `model/types.ts`: 도메인 타입, ViewModel 정의
    - TODO(subPick): 구독(Subscription) 도메인의 ViewModel 필드를 정의해야 함
    - 예) id, name(서비스명), price(가격), billingCycle(결제주기), nextBillingDate(다음 결제일), status(구독상태) 등
    - 실제 DB 스키마 확정 후 작성
  - `api/repository.ts`: 읽기 전용 작업
    - TODO(subPick): getAllSubscriptions, getSubscriptionById 등 구독 조회 메서드 정의 필요
  - `lib/mappers.ts`: Entity → ViewModel 변환

- ✅ **settings entity**
  - `model/types.ts`: 설정 타입 정의
  - `api/repository.ts`: 설정 읽기 작업
  - `lib/mappers.ts`: 데이터 변환

### 2. Features Layer (CUD 작업)

- ✅ **subscription-management feature**
  - `model/types.ts`: DTO 정의 (Create, Update, Delete)
    - TODO(subPick): 구독 생성/수정/삭제 DTO 필드 정의 필요
    - 예) CreateSubscriptionDto, UpdateSubscriptionDto, DeleteSubscriptionDto
  - `api/mutations.ts`: CUD 작업 구현
    - TODO(subPick): createSubscription, updateSubscription, deleteSubscription 등 뮤테이션 메서드 구현 필요

- ✅ **settings-management feature**
  - `model/types.ts`: 설정 DTO
  - `api/mutations.ts`: 설정 업데이트 작업

### 3. Widgets Layer

- ✅ **subscription-list widget**
  - `model/store.ts`: Zustand store (entities + features 조합)
    - TODO(subPick): 구독 목록 store 상태 구조 정의 필요
    - 예) subscriptions[], selectedSubscription, filters, pagination 등
  - Read: entities/subscription 사용
  - Write: features/subscription-management 사용

- ✅ **settings widget**
  - `model/store.ts`: 설정 관리 store
  - Read: entities/settings 사용
  - Write: features/settings-management 사용

### 4. Shared Layer

- ✅ **shared/api**
  - `database.ts`: 데이터베이스 초기화 및 접근

- ✅ **shared/config**
  - `theme.ts`: 테마 설정
  - `constants.ts`: 앱 상수

- ✅ **shared/lib**
  - `date-utils.ts`: 날짜 유틸리티

## 🎯 핵심 개선사항

### 1. **책임 분리**

- **Entities**: 읽기 전용 작업
- **Features**: CUD 작업
- **Widgets**: 복잡한 UI 로직
- **Shared**: 공통 리소스

### 2. **의존성 방향**

```
app → pages → widgets → features → entities → shared
```

### 3. **데이터 흐름**

- **Read Flow**: entities → widgets → pages
- **Write Flow**: pages → widgets → features

### 4. **타입 안정성**

- Entity 타입과 ViewModel 분리
- DTO를 통한 명확한 데이터 전달
- 각 레이어별 명확한 타입 정의

## 📝 마이그레이션 가이드

### 기존 코드 사용 방법

1. **Store 사용**

```typescript
// 기존
import { useSubscriptionStore } from '@/shared/stores/subscriptionStore';

// 새로운 방식
import { useSubscriptionListStore } from '@/widgets/subscription-list';
```

2. **타입 사용**

```typescript
// 기존
import { Subscription } from '@/shared/db/database';

// 새로운 방식
import { SubscriptionViewModel } from '@/entities/subscription';
```

3. **데이터베이스 작업**

```typescript
// 기존 (직접 호출)
import { saveSubscription, getAllSubscriptions } from '@/shared/db/database';

// 새로운 방식 (레이어 분리)
// Read
import { subscriptionRepository } from '@/entities/subscription';
const subscriptions = await subscriptionRepository.getAllSubscriptions();

// Write
import { createSubscription } from '@/features/subscription-management';
const result = await createSubscription(dto);
```

## ⚠️ 주의사항

1. **점진적 마이그레이션**: 기존 코드와 새로운 코드가 공존 가능
2. **의존성 규칙 준수**: 상위 레이어는 하위 레이어만 import
3. **Read/Write 분리**: entities는 Read만, features는 Write만
4. **타입 일관성**: ViewModel은 UI용, Entity는 DB용

## 🚀 다음 단계

1. UI 컴포넌트 마이그레이션
2. 기존 app 폴더의 페이지 리팩토링
3. 테스트 코드 추가
4. 기존 shared 폴더 정리
