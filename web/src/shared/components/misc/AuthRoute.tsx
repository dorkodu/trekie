import { useAppStore } from '@web/shared/stores/appStore'
import { Navigate, Outlet } from 'react-router-dom'

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
