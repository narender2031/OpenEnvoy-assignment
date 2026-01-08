import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { store as appStore } from '@/store/store'
import customersReducer from '@/features/customers/customersSlice'
import type { RootState } from '@/store/store'

// Create a test store with optional preloaded state
export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      customers: customersReducer,
    },
    preloadedState: preloadedState as RootState,
  })
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  store?: ReturnType<typeof createTestStore>
  preloadedState?: Partial<RootState>
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = preloadedState ? createTestStore(preloadedState) : appStore,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

export { renderWithProviders as render }
