import { Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from '@/shared/stores/appStore'

export default {
  Require() {
    const authorized = useAppStore($ => $.session)
    return authorized ? <Outlet /> : <Navigate to="/" replace />
  },
  Prevent() {
    const authorized = useDorkoduStore($ => $.userId)
    return !authorized ? <Outlet /> : <Navigate to="/home" replace />
  },
} // Import as Auth or AuthRoute, as you fancy!
