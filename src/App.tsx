import { Routes, Route } from 'react-router-dom'
import { DashboardLayout } from '@/layouts'
import { routes } from './routes'

function App() {
  return (
    <DashboardLayout>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </DashboardLayout>
  )
}

export default App
