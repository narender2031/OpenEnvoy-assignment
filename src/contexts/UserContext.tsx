import { createContext, useContext, ReactNode } from 'react'

export interface User {
  name: string
  role: string
  avatar: string
}

interface UserContextValue {
  user: User
}

const defaultUser: User = {
  name: 'Evano',
  role: 'Project Manager',
  avatar: 'https://i.pravatar.cc/40?img=8',
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
  user?: User
}

export function UserProvider({ children, user = defaultUser }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser(): User {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context.user
}
