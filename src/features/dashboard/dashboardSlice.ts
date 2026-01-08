import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import type { DashboardStats, Activity } from '@/types/dashboard'
import { dashboardService } from '@/services/dashboardService'

interface DashboardState {
  stats: DashboardStats | null
  activities: Activity[]
  statsStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  activitiesStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  statsError: string | null
  activitiesError: string | null
}

const initialState: DashboardState = {
  stats: null,
  activities: [],
  statsStatus: 'idle',
  activitiesStatus: 'idle',
  statsError: null,
  activitiesError: null,
}

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    return dashboardService.getStats()
  }
)

export const fetchActivities = createAsyncThunk(
  'dashboard/fetchActivities',
  async () => {
    return dashboardService.getActivities()
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsStatus = 'loading'
        state.statsError = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded'
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsStatus = 'failed'
        state.statsError = action.error.message || 'Failed to fetch stats'
      })
      .addCase(fetchActivities.pending, (state) => {
        state.activitiesStatus = 'loading'
        state.activitiesError = null
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.activitiesStatus = 'succeeded'
        state.activities = action.payload
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.activitiesStatus = 'failed'
        state.activitiesError = action.error.message || 'Failed to fetch activities'
      })
  },
})

export const selectDashboardStats = (state: RootState) => state.dashboard.stats
export const selectActivities = (state: RootState) => state.dashboard.activities
export const selectStatsStatus = (state: RootState) => state.dashboard.statsStatus
export const selectActivitiesStatus = (state: RootState) => state.dashboard.activitiesStatus

export default dashboardSlice.reducer
