import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Route, useAppStore } from "./stores/appStore";
import OverlayLoader from "./components/loaders/OverlayLoader";
import { useEffect } from "react";
import UpdateSWModal from "./components/modals/UpdateSWModal";
import EditProfileModal from "./components/modals/EditProfileModal";
import { useApiStore } from "./stores/apiStore";
import { IUser } from "@api/types/user";
import HabitEditorModal from "./components/modals/HabitEditorModal";
import GoalEditorModal from "./components/modals/GoalEditorModal";
import MemoryEditorModal from "./components/modals/MemoryEditorModal";

function App() {
  const loading = useAppStore(state => state.loading);

  useEffect(() => {
    if (!loading.auth) return;

    // TODO: Perform authorization logic

    const user: IUser = {
      id: "0",
      joinDate: Date.now(),
      name: "Your Name",
      username: "your.username",
      bio: "Your biography.",
      followerCount: 0,
      followingCount: 0,
      dailyXpCurrent: 0,
      dailyXpTarget: 0,
      totalXp: 0,
      lastXpDate: Date.now(),
      streaks: 0,
      lastStreakDate: undefined,
    }

    const authUser: IUser = useApiStore.getState().users[user.id] ?? user;
    useApiStore.getState().auth(authUser);
  }, [loading.auth]);

  const location = useLocation();

  useEffect(() => {
    let route: Route = "any";

    if (location.pathname.indexOf("/home") !== -1) route = "home";
    else if (location.pathname.indexOf("/explore") !== -1) route = "explore";
    else if (location.pathname.indexOf("/life") !== -1) route = "life";
    else if (location.pathname.indexOf("/community") !== -1) route = "community";
    else if (location.pathname.indexOf("/market") !== -1) route = "market";

    else if (location.pathname.indexOf("/premium") !== -1) route = "premium";
    else if (location.pathname.indexOf("/archive") !== -1) route = "archive";
    else if (location.pathname.indexOf("/settings") !== -1) route = "settings";

    useAppStore.setState(s => { s.route = route; });
  }, [location.pathname]);

  useEffect(() => {
    const task = () => { useApiStore.getState().updateStats() }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    const timeout = setTimeout(task, tomorrow.getTime() - today.getTime());
    const interval = setInterval(task, 24 * 60 * 60 * 1000);
    () => {
      clearTimeout(timeout);
      clearTimeout(interval);
    }
  }, []);

  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        {(loading.auth) && <OverlayLoader full={true} />}
        {!loading.auth && <Outlet />}

        {/* Modals */}
        <UpdateSWModal />
        <EditProfileModal />

        <HabitEditorModal />
        <GoalEditorModal />
        <MemoryEditorModal />
      </MantineProvider>

      <ScrollRestoration />
    </>
  )
}

export default App
