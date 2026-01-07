# Customers Dashboard - Design Document

## Overview

Recreate the CRM Dashboard Customers screen from the provided Figma design, including a Storybook design system and architecture documentation.

## Decisions Made

### Tech Stack
| Decision | Choice |
|----------|--------|
| Build Tool | Vite + React 18 + TypeScript |
| Styling | CSS Modules with CSS Variables (design tokens) |
| State Management | Redux Toolkit with createAsyncThunk |
| Icons | Lucide React |
| Testing | Vitest + React Testing Library + Storybook interaction tests |
| Folder Structure | Feature-based |

### Data Layer
- Service layer pattern for API abstraction
- Redux orchestrates data fetching via thunks
- Mock data with 256K entries
- Client-side search/sort/pagination via Redux selectors

## Deliverables

1. **Running App** (`npm run dev`)
   - Customers page with full functionality
   - Search, sort, pagination working
   - Loading/empty/error states

2. **Storybook** (`npm run storybook`)
   - All design system components documented
   - Interactive stories with variants
   - Interaction tests for key flows

3. **architecture.md**
   - Located at `docs/architecture.md`
   - Documents tech decisions and patterns

## Component Breakdown

### Design System (Storybook)

**Primitives:**
- Button (primary, secondary, ghost variants)
- Input (text input with optional icon)
- SearchInput (extends Input)
- Badge (success/danger variants for Active/Inactive)
- Avatar (image with fallback)
- Dropdown (for sort selector)

**Composites:**
- StatCard (icon + label + value + trend)
- Table (with loading/empty/error states)
- Pagination (pages + prev/next + entry count)
- Sidebar (nav items + user profile)
- TopBar (greeting + global search)

### Feature Components
- DashboardLayout (Sidebar + TopBar + content)
- CustomersPage (stats strip + table card)
- CustomersTable (feature-specific table wrapper)

## Page Layout

```
┌──────────────────────────────────────────────────────────┐
│ ┌─────────┐ ┌──────────────────────────────────────────┐ │
│ │ Sidebar │ │ TopBar: Hello Evano 👋    [Search]       │ │
│ │         │ ├──────────────────────────────────────────┤ │
│ │ • Dash  │ │ Stats Strip                              │ │
│ │ • Prod  │ │ [Total] [Members] [Active Now]           │ │
│ │ • Cust ←│ ├──────────────────────────────────────────┤ │
│ │ • Inc   │ │ All Customers        [Search] [Sort by]  │ │
│ │ • Promo │ │ ┌──────────────────────────────────────┐ │ │
│ │ • Help  │ │ │ Table with customer data             │ │ │
│ │         │ │ └──────────────────────────────────────┘ │ │
│ │ [User]  │ │ Showing 1-8 of 256K          [Pagination]│ │
│ └─────────┘ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

## Redux State Shape

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

## Table Behaviors

### Search
- Filters by name, company, email
- Case-insensitive matching
- Client-side filtering

### Sort Options
- Newest (by createdAt descending)
- Name (alphabetical A-Z)
- Status (Active first)

### Pagination
- Page size: 8 entries
- Shows "Showing data X to Y of Z entries"
- Pages 1...40 with prev/next navigation

### States
- **Loading:** Spinner + message
- **Empty:** Icon + "No customers found"
- **Error:** Message + Retry button

## Testing Plan

### Component Tests
- Badge variants render correctly
- Pagination callbacks fire on click
- SearchInput handles input changes

### Hook Tests
- useCustomersTable filters correctly
- Pagination returns correct slice
- Sort orders data properly

### Redux Tests
- Slice handles thunk lifecycle
- Selectors compute derived state

### Storybook Interaction Tests
- Search filters table rows
- Sort changes order
- Pagination navigates pages
