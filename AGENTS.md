# Developer Context

**Developer Profile:**

- Web developer experienced with Next.js, React.js, Vercel deployment
- First time building mobile apps with React Native + Expo
- Unfamiliar with mobile development patterns

**Development Approach During Implementation:**
When writing code or facing development decisions, always explain differences between web and mobile approaches:

1. Show how it works in web (Next.js/React)
2. Show how it works in mobile (React Native/Expo)
3. Provide visual code examples side-by-side
4. Explain the "why" behind the differences

This context should be remembered for all development tasks throughout this project.

# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Expo Router routes (`_layout.tsx`, tab screens). Entry is `expo-router/entry`.
- `src/`: Feature-Sliced Design (see `FSD_ARCHITECTURE.md`).
  - `entities/`, `features/`, `shared/`: domain, feature logic, and cross-cutting code.
  - Common patterns: `model/`, `ui/`, `api/`, `lib/`, `stores/`.
- `assets/`: images, fonts, sounds. Native: `android/`, `ios/`.
- Config: `babel.config.js`, `eslint.config.js`, `metro.config.js`, `tsconfig.json`, `app.json`.

## Build, Test, and Development Commands

- `pnpm start` (or `npm run start`): Launch Expo dev server.
- `pnpm android` / `pnpm ios`: Build & run on device/simulator.
- `pnpm web`: Run the web target.
- `pnpm lint`: Run ESLint checks.
- `node scripts/reset-project.js`: Clean/reset local state.

## Coding Style & Naming Conventions

- Language: TypeScript. Prefer explicit types on public APIs.
- Indentation: 2 spaces; semicolons optional; single quotes preferred.
- File names: React components `PascalCase.tsx` (e.g., `SubscriptionList.tsx`); utilities `kebab-case.ts` (e.g., `date-utils.ts`).
- Exports: co-locate `index.ts` to re-export module public surface.
- Folder layout: follow FSD (avoid cross-layer imports; import up only via public `index.ts`).
- Linting: `eslint` via `expo lint`; fix issues before committing.

## Testing Guidelines

- No formal test suite yet. When adding tests, prefer Jest + React Native Testing Library.
- Place tests next to source as `*.test.ts(x)`; aim for critical path coverage (stores, mappers, services).

## Commit & Pull Request Guidelines

- Commits: imperative mood, concise scope. Example: `feat(subscription): add subscription renewal notification`.
- PRs: clear description, linked issues, screenshots for UI changes, and notes on testing.
- CI readiness: run `pnpm lint` and ensure app boots (`pnpm start`) before requesting review.

## Security & Configuration Tips

- Secrets: use `.env.local` (see `.env.example`). Never commit secrets or private keys.
- Native keys/certs: keep outside VCS; if required locally, use ignored paths under `keys/`.
- Crashes/telemetry: Sentry is integrated; do not log PII.

## Agent Notes

- Respect FSD boundaries; avoid broad refactors.
- Keep patches minimal and focused; update related docs when touching public APIs.

# Component Development with React Native Reusables

When creating new components, **ALWAYS use react-native-reusables** library as the foundation.

## Component Creation Requirements

### 1. Use react-native-reusables as Base

- Import components from `react-native-reusables` (not StyleSheet or inline styles)
- Extend base components with Tailwind styling
- Maintain component accessibility standards

### 2. Apply Tailwind CSS Styling (via NativeWind)

- Use Tailwind utility classes for all styling
- Use `cn()` utility to safely merge class names
- Support responsive design with Tailwind breakpoints
- Example: `className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"`

### 3. Type-Safe Variants with CVA

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonStyles = cva('rounded-lg font-semibold', {
  variants: {
    size: { sm: 'px-3 py-2', md: 'px-4 py-3', lg: 'px-6 py-4' },
    variant: { primary: 'bg-blue-500', secondary: 'bg-gray-200' },
  },
  defaultVariants: { size: 'md', variant: 'primary' },
});

export interface ButtonProps extends VariantProps<typeof buttonStyles> {
  children: React.ReactNode;
  onPress?: () => void;
}
```

### 4. FSD Structure

- Place components in appropriate FSD layer: `shared/components/ui/`, or entity/feature slice
- Export through `index.ts` for clean public API
- Use TypeScript for all props interfaces

## ✅ DO's

- Use `react-native-reusables` base components
- Apply Tailwind CSS classes via NativeWind
- Use CVA for type-safe variants
- Include TypeScript prop interfaces
- Support both web and mobile rendering

## ❌ DON'Ts

- StyleSheet.create() for styling
- Inline style objects
- Generic `<View>` without reusable base
- Hardcoded colors/sizes without Tailwind

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
