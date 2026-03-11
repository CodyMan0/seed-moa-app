# 씨앗모아 - 성경 암송 앱

마음 밭에 말씀을 심어보세요.

## 주요 기능

- **성경 구절 선택**: 개역개정 성경에서 구절을 검색하고 암송 목록에 추가
- **암송 연습**: 전체보기 → 초성힌트 → 빈칸채우기 → 타이핑 4단계 학습
- **암송 관리**: 암송중/완료 상태 관리, 직접 완료 처리
- **월별 성장**: 매월 암송 일수에 따른 5단계 성장 (씨앗 → 새싹 → 줄기 → 꽃봉오리 → 꽃)
- **캘린더**: 암송한 날(초록)/놓친 날(빨강) 시각화
- **알림 설정**: 매일 암송 알림 시간 및 목표 일수 설정
- **더보기**: 프로필, 이름 변경, 문의하기, 이용약관, 개인정보처리방침

## 기술 스택

- **Framework**: Expo (React Native) + expo-router
- **Styling**: NativeWind (Tailwind CSS)
- **Backend**: Supabase (Auth, PostgreSQL, RLS)
- **Architecture**: Feature Sliced Design (FSD)
- **Language**: TypeScript

## 프로젝트 구조

```
apps/mobile/
├── app/                    # 라우팅 (expo-router)
│   ├── (auth)/             # 로그인, 회원가입, 비밀번호 찾기
│   ├── (tabs)/             # 홈, 성경, 성장, 내 암송, 더보기
│   └── practice/           # 암송 연습 화면
├── src/
│   ├── entities/           # 비즈니스 엔티티 (memorize, bible, monthly-stats)
│   ├── features/           # 비즈니스 로직 (auth, review, practice, notifications)
│   ├── shared/             # 공통 UI, 유틸, Supabase 설정
│   └── widgets/            # 조합 UI (calendar, growth-journey)
└── supabase/
    └── migrations/         # DB 마이그레이션
```

## 실행 방법

```bash
pnpm install
cd apps/mobile
npx expo start
```
