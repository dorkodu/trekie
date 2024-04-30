import { Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from '@/shared/stores/appStore'

function isAuthed() {
  return !useAppStore.getState().session
}

export default {
  Require() {
    return isAuthed() ? <Outlet /> : <Navigate to="/" replace />
  },
  Prevent() {
    return !isAuthed() ? <Outlet /> : <Navigate to="/home" replace />
  },
} // Import as Auth or AuthRoute, as you fancy!
