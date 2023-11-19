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
import CreateHabitModal from "./components/modals/CreateHabitModal";
import CreateGoalModal from "./components/modals/CreateGoalModal";
import CreateMemoryModal from "./components/modals/CreateMemoryModal";

function App() {
  const loading = useAppStore(state => state.loading);

  useEffect(() => {
    // TODO: Perform authorization logic
    const user: IUser = {
      id: Date.now().toString(),
      joinDate: Date.now(),
      name: "John Doe 👑wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      username: "johndoewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      bio: "Hello, world!\nThis is my biography. I am John Doe. 👋\nThis is my website https://dorkodu.com",
      followerCount: 123,
      followingCount: 123,
    }
    useAppStore.setState(s => { s.loading.auth = false });
    useApiStore.setState(s => { s.userId = user.id });
    useApiStore.getState().addUser(user);

    useApiStore.getState().addHabit({ id: "0", userId: user.id, title: "test", description: "test", count: 1234 })
    useApiStore.getState().addGoal({ id: "0", userId: user.id, title: "test", description: "test", tasksTodo: 10, tasksDone: 5 })
    useApiStore.getState().addMemory({ id: "0", userId: user.id, date: Date.now(), description: "test", favourites: 1234567 })

    const testUser: IUser = {
      id: (Date.now() + 1).toString(),
      joinDate: Date.now(),
      name: "Test User 🤖wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      username: "testuserwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      bio: "👋 Hey, I am a test user!",
      followerCount: 1234,
      followingCount: 1234567,
      premium: true,
      follower: true,
    }
    useApiStore.getState().addUser(testUser);
  }, []);

  const location = useLocation();

  useEffect(() => {
    let route: Route = "any";

    if (location.pathname.indexOf("/home") !== -1) route = "home";
    else if (location.pathname.indexOf("/explore") !== -1) route = "explore";
    else if (location.pathname.indexOf("/track") !== -1) route = "track";
    else if (location.pathname.indexOf("/community") !== -1) route = "community";
    else if (location.pathname.indexOf("/marketplace") !== -1) route = "marketplace";

    else if (location.pathname.indexOf("/premium") !== -1) route = "premium";
    else if (location.pathname.indexOf("/archive") !== -1) route = "archive";
    else if (location.pathname.indexOf("/settings") !== -1) route = "settings";

    useAppStore.setState(s => { s.route = route; });
  }, [location.pathname]);

  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        {(loading.auth) && <OverlayLoader full={true} />}
        {!loading.auth && <Outlet />}

        {/* Modals */}
        <UpdateSWModal />
        <EditProfileModal />

        <CreateHabitModal />
        <CreateGoalModal />
        <CreateMemoryModal />
      </MantineProvider>

      <ScrollRestoration />
    </>
  )
}

export default App
