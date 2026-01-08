import { configureStore } from '@reduxjs/toolkit'
import customersReducer from '../features/customers/customersSlice'
import { dashboardReducer } from '../features/dashboard'
import { productReducer } from '../features/product'
import { incomeReducer } from '../features/income'
import { promoteReducer } from '../features/promote'
import { helpReducer } from '../features/help'

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    dashboard: dashboardReducer,
    product: productReducer,
    income: incomeReducer,
    promote: promoteReducer,
    help: helpReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
