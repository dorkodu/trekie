import { Navigate, Outlet } from 'react-router-dom'
import { trekie } from "#/lib/trekie"

export default {
  Require() {
    const authorized = trekie.game(state => state.userId)
    return authorized ? <Outlet /> : <Navigate to="/" replace />
  },
  Prevent() {
    const authorized = trekie.game(state => state.userId)
    return !authorized ? <Outlet /> : <Navigate to="/home" replace />
  },
} // Import as Auth or AuthRoute, as you fancy!
