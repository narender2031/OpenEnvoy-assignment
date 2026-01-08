# Architecture

## Goals

- Pixel-accurate recreation of the Customers screen from the Figma design
- Reusable design system documented in Storybook
- Clean separation of concerns for easy backend integration
- Demonstrate solid React/TypeScript fundamentals

## Non-Goals

- Other dashboard pages (Dashboard, Product, Income, Promote, Help)
- Real authentication or backend API
- Server-side pagination (client-side for mock data)

## Tech Stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | React 18 + TypeScript | Required by assignment |
| Build Tool | Vite | Fast DX, native ESM, seamless Storybook integration |
| Styling | CSS Modules + CSS Variables | Full control, no dependencies, scoped styles, zero runtime cost |
| State Management | Redux Toolkit | Centralized state, async thunks, memoized selectors with createSelector |
| Icons | lucide-react | Lightweight, tree-shakeable, matches design aesthetic |
| Testing | Vitest + React Testing Library | Vite-native, Jest-compatible, component-focused |
| Documentation | Storybook 8 | Component catalog, visual testing, autodocs |

## Project Structure

```
src/
├── components/              # Design System (reusable, documented in Storybook)
│   ├── primitives/          # Button, Badge, SearchInput, Select
│   ├── data-display/        # StatCard, Table, AvatarGroup, TrendIndicator
│   ├── navigation/          # Pagination
│   ├── feedback/            # Spinner, EmptyState, ErrorState
│   └── index.ts             # Barrel export for clean imports
├── features/
│   └── customers/           # Customers page feature module
│       ├── CustomersPage.tsx
│       ├── CustomersPage.module.css
│       └── customersSlice.ts
├── layouts/                 # App-level layouts
│   ├── DashboardLayout.tsx
│   ├── Sidebar/
│   └── TopBar/
├── services/                # API service layer (abstracts data fetching)
│   └── customerService.ts
├── mocks/                   # Mock data generators
│   └── customers.ts
├── store/                   # Redux store configuration
│   ├── store.ts
│   └── hooks.ts
├── types/                   # Shared TypeScript interfaces
│   └── customer.ts
├── styles/                  # Global styles and design tokens
│   ├── tokens.css
│   └── global.css
└── test/                    # Test utilities
    ├── setup.ts
    └── utils/
        └── renderWithProviders.tsx
```

## Design System

### Design Tokens

All design values are CSS custom properties defined in `src/styles/tokens.css`:

```css
:root {
  /* Colors - Primary */
  --color-primary: #00AC4F;
  --color-primary-light: #E6F9EE;

  /* Colors - Danger */
  --color-danger: #DF0404;
  --color-danger-light: #FDE8E8;

  /* Colors - Text */
  --color-text: #292D32;
  --color-text-secondary: #757575;
  --color-text-muted: #B5B7C0;

  /* Colors - Background */
  --color-background: #FAFBFF;
  --color-surface: #FFFFFF;
  --color-border: #EEEEEE;

  /* Spacing (4px scale) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Border Radius */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* Typography */
  --font-family: 'Inter', -apple-system, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 22px;
}
```

### Component Categories

| Category | Components | Purpose |
|----------|------------|---------|
| **Primitives** | Button, Badge, SearchInput, Select | Atomic building blocks |
| **Data Display** | StatCard, Table, AvatarGroup, TrendIndicator | Data visualization |
| **Navigation** | Pagination | User navigation controls |
| **Feedback** | Spinner, EmptyState, ErrorState | State communication to users |

### Storybook Organization

Stories follow the component category structure:
- `Primitives/Button`, `Primitives/Badge`, `Primitives/SearchInput`, `Primitives/Select`
- `Data Display/StatCard`, `Data Display/Table`, `Data Display/AvatarGroup`, `Data Display/TrendIndicator`
- `Navigation/Pagination`
- `Feedback/Spinner`, `Feedback/EmptyState`, `Feedback/ErrorState`

## Data Layer

### TypeScript Types

```typescript
interface Customer {
  id: string
  name: string
  company: string
  phone: string
  email: string
  country: string
  status: 'active' | 'inactive'
  createdAt: Date
}

interface Stats {
  totalCustomers: number
  totalCustomersTrend: number
  members: number
  membersTrend: number
  activeNow: number
  activeNowAvatars: string[]
}

type SortBy = 'newest' | 'name' | 'status'
```

### Redux State

```typescript
interface CustomersState {
  customers: Customer[]
  stats: Stats | null
  customersStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  statsStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  customersError: string | null
  statsError: string | null
  search: string
  sortBy: SortBy
  currentPage: number
  pageSize: number // Fixed at 8
}
```

### Memoized Selectors

Using Redux Toolkit's `createSelector` for performance:

- `selectFilteredCustomers` - Filters by search term (name, company, email)
- `selectSortedCustomers` - Applies sort order to filtered results
- `selectPaginatedCustomers` - Returns current page slice
- `selectTotalPages` - Calculates total pages from filtered count
- `selectTotalEntries` - Returns total filtered entries

### Mock Data Strategy

The service layer (`customerService.ts`) abstracts all data fetching:

```typescript
export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    await delay(500)  // Simulated network latency
    return mockCustomers
  },
  async getStats(): Promise<Stats> {
    await delay(500)
    return mockStats
  }
}
```

**Backend Integration:** Replace mock implementations with real API calls:

```typescript
export const customerService = {
  async getCustomers() {
    const res = await fetch('/api/customers')
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
  }
}
```

### Filtering, Sorting, Pagination

All performed client-side via Redux selectors:

| Feature | Implementation |
|---------|----------------|
| **Search** | Case-insensitive match on name, company, email |
| **Sort - Newest** | By `createdAt` descending |
| **Sort - Name** | Alphabetical A-Z |
| **Sort - Status** | Active first, then inactive |
| **Pagination** | 8 items per page, 1-indexed |

## Error Handling

### Loading States

- Separate status tracking for customers and stats (`customersStatus`, `statsStatus`)
- Spinner component with accessible loading indicator
- Non-blocking: stats can load independently of customers

### Error States

- `ErrorState` component with retry functionality
- Errors are non-fatal: page remains functional
- Contextual error messages based on failure type

### Empty States

- `EmptyState` component with contextual messaging
- Different messages for no results vs. search with no matches

## Accessibility

- Semantic HTML (`<nav>`, `<article>`, `<table>`, `<section>`)
- ARIA labels on all interactive elements
- Screen reader-only text via `.sr-only` utility class
- Keyboard navigation support throughout
- Focus indicators on interactive elements
- Color contrast meeting WCAG AA standards
- Role attributes for dynamic content (`role="status"`, `role="alert"`)

## Responsive Design

CSS media queries for breakpoints:
- `> 1024px`: 3-column stats grid
- `768px - 1024px`: 2-column stats grid
- `< 768px`: Single column, stacked controls

## Scripts

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build",
  "test": "vitest",
  "lint": "eslint ."
}
```

## Path Aliases

TypeScript and Vite configured with `@/` alias for clean imports:

```typescript
import { Button, Badge } from '@/components'
import { useAppSelector } from '@/store/hooks'
```
