import type { UserProfile, ProfileStats } from '@/types/profile'

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const mockProfile: UserProfile = {
  id: 'user-1',
  name: 'Evano',
  email: 'evano@example.com',
  role: 'Project Manager',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  department: 'Operations',
  joinedDate: new Date('2022-03-15'),
  bio: 'Experienced project manager with a passion for building great products and leading cross-functional teams. Focused on delivering value and fostering collaboration.',
}

const mockStats: ProfileStats = {
  projectsCompleted: 47,
  tasksCompleted: 312,
  hoursLogged: 1840,
  teamSize: 12,
}

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    await delay(400)
    return mockProfile
  },

  async getStats(): Promise<ProfileStats> {
    await delay(300)
    return mockStats
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await delay(500)
    return { ...mockProfile, ...updates }
  },
}
