export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  phone: string
  location: string
  department: string
  joinedDate: Date
  bio: string
}

export interface ProfileStats {
  projectsCompleted: number
  tasksCompleted: number
  hoursLogged: number
  teamSize: number
}
