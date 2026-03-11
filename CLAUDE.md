# Architecture Overview

This is a monorepo following Feature Sliced Design (FSD) architecture with three main applications.

## FSD Layer Dependencies

Follow strict dependency rules (upper layers can only depend on lower layers):

```
app → widgets → features → entities → shared
```

Within packages that implement FSD:

- **entities**: Business entities with Read operations only
  - Use view-specific types (ViewModels) for display/read components
  - CAN import SQL database types for read operations only
  - Use `api/` folder for database logic (read operations like get*, fetch*, )
  - Structure: `model/`, `api/`, `ui/`, `lib/`
  - **IMPORTANT**: All read operations (GET/SELECT) must be in entities layer
- **features**: Business logic with CUD operations
  - Use SQL database types for mutations
  - Use `api/` folder for database logic (CUD operations like create*, update*, delete\*)
  - Handle data transformation between database and view models
  - **IMPORTANT**: Features can import from entities for read operations
- **widgets**: Composed UI blocks combining different slices(domain) features or entities
- Each slice exports through `index.ts` for clean public API

# Build Verification Rules

**MUST check before any commit:**

1. `npx tsc --noEmit` - Type check
2. `npm run lint` - Lint check
3. `npx expo prebuild --clean` - For major changes (native config validation)

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
