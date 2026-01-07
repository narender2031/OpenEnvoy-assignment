import { CustomersPage } from './features/customers/CustomersPage'
import { DashboardLayout } from './layouts/DashboardLayout'

function App() {
  return (
    <DashboardLayout>
      <CustomersPage />
    </DashboardLayout>
  )
}

export default App
