# Architecture

## Goals
- Pixel-accurate recreation of Customers screen from Figma design
- Reusable design system documented in Storybook
- Clean separation for easy backend integration
- Demonstrate solid React/TypeScript fundamentals

## Non-goals
- Other dashboard pages (Dashboard, Product, Income, Promote, Help)
- Real authentication or backend API
- Mobile responsiveness (desktop only per design)
- Browser support beyond modern evergreen browsers

## Tech Stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | React 18 + TypeScript | Required by assignment |
| Build Tool | Vite | Fast DX, native ESM, seamless Storybook integration |
| Styling | CSS Modules + CSS Variables | Full control, no dependencies, scoped styles |
| State Management | Redux Toolkit (createAsyncThunk) | Centralized state, scalable patterns |
| Icons | Lucide React | Lightweight, tree-shakeable, matches design aesthetic |
| Testing | Vitest + RTL + Storybook | Vite-native testing, comprehensive coverage |

## Project Structure

```
src/
├── components/           # Design System (documented in Storybook)
│   ├── Button/
│   ├── Input/
│   ├── SearchInput/
│   ├── Badge/
│   ├── Avatar/
│   ├── Dropdown/
│   ├── StatCard/
│   ├── Table/
│   ├── Pagination/
│   └── Sidebar/
├── features/
│   └── customers/        # Customers page feature
│       ├── CustomersPage.tsx
│       ├── customersSlice.ts
│       └── useCustomersTable.ts
├── services/             # API service layer
│   └── customerService.ts
├── store/                # Redux store configuration
├── types/                # Shared TypeScript interfaces
├── mocks/                # Mock data
├── layouts/              # Page layouts (DashboardLayout)
└── styles/               # Global styles, design tokens
```

## Design System

### Design Tokens (CSS Variables)
```css
:root {
  /* Colors */
  --color-primary: #00AC4F;
  --color-danger: #DF0404;
  --color-text: #292D32;
  --color-text-muted: #757575;
  --color-background: #FAFBFF;
  --color-surface: #FFFFFF;
  --color-border: #EEEEEE;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Typography */
  --font-family: 'Inter', -apple-system, sans-serif;
}
```

### Components

**Primitives:**
- `Button` - variants: primary, secondary, ghost
- `Input` - text input with optional icon
- `SearchInput` - search-specific input with icon
- `Badge` - variants: success (green), danger (red)
- `Avatar` - user image with fallback
- `Dropdown` - select dropdown for sorting

**Composites:**
- `StatCard` - icon + label + value + trend indicator
- `Table` - data table with loading/empty/error states
- `Pagination` - page navigation with prev/next
- `Sidebar` - navigation with active states and user profile

## Data Layer

### Types
```typescript
interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  country: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface Stats {
  totalCustomers: number;
  totalCustomersTrend: number;
  members: number;
  membersTrend: number;
  activeNow: number;
  activeNowAvatars: string[];
}
```

### Redux State
```typescript
interface CustomersState {
  customers: Customer[];
  stats: Stats | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  search: string;
  sortBy: 'newest' | 'name' | 'status';
  currentPage: number;
  pageSize: 8;
}
```

### Mock Data Strategy
- Service layer (`customerService.ts`) abstracts all API calls
- Mock data generates 256K customer entries for realistic testing
- Simulated network delay (500ms) for loading states
- **Backend swap:** Change service implementation from mock to real `fetch` calls

### Filtering, Sorting, Pagination
- **Search:** Client-side filtering by name, company, email (case-insensitive)
- **Sort:** Client-side sorting by newest (createdAt), name (alphabetical), status
- **Pagination:** Page size of 8, calculated from filtered/sorted results
- All logic encapsulated in Redux selectors for memoization

## Error Handling

### Table States
1. **Loading:** Spinner with "Loading customers..." message
2. **Empty:** Friendly icon + "No customers found" with suggestion
3. **Error:** Error message + "Try again" button for retry

### Non-fatal Errors
- Table errors don't crash the page
- Stats and navigation remain functional
- User can retry failed requests

## Testing Strategy

### Unit Tests (Vitest + RTL)
- Component rendering and variants
- Custom hook logic (useCustomersTable)
- Redux slice reducers and selectors

### Storybook Interaction Tests
- User flows (search, sort, paginate)
- State transitions
- Accessibility checks

## Scripts

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build",
  "test": "vitest"
}
```
