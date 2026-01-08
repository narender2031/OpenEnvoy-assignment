import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { profileService } from '@/services/profileService'
import type { UserProfile, ProfileStats } from '@/types/profile'
import type { RootState } from '@/store/store'

interface ProfileState {
  profile: UserProfile | null
  stats: ProfileStats | null
  profileStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  statsStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProfileState = {
  profile: null,
  stats: null,
  profileStatus: 'idle',
  statsStatus: 'idle',
  error: null,
}

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  return await profileService.getProfile()
})

export const fetchProfileStats = createAsyncThunk('profile/fetchStats', async () => {
  return await profileService.getStats()
})

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.profileStatus = 'loading'
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileStatus = 'succeeded'
        state.profile = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileStatus = 'failed'
        state.error = action.error.message || 'Failed to fetch profile'
      })
      .addCase(fetchProfileStats.pending, (state) => {
        state.statsStatus = 'loading'
      })
      .addCase(fetchProfileStats.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded'
        state.stats = action.payload
      })
      .addCase(fetchProfileStats.rejected, (state, action) => {
        state.statsStatus = 'failed'
        state.error = action.error.message || 'Failed to fetch stats'
      })
  },
})

// Selectors
const selectProfileState = (state: RootState) => state.profile

export const selectProfile = createSelector(selectProfileState, (state) => state.profile)
export const selectProfileStats = createSelector(selectProfileState, (state) => state.stats)
export const selectProfileStatus = createSelector(selectProfileState, (state) => state.profileStatus)
export const selectStatsStatus = createSelector(selectProfileState, (state) => state.statsStatus)
export const selectProfileError = createSelector(selectProfileState, (state) => state.error)

export default profileSlice.reducer
