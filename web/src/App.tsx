import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useAppStore } from "./stores/appStore";
import OverlayLoader from "./components/loaders/OverlayLoader";
import { useEffect } from "react";
import UpdateSWModal from "./components/modals/UpdateSWModal";
import EditProfileModal from "./components/modals/EditProfileModal";
import { useApiStore } from "./stores/apiStore";
import HabitEditorModal from "./components/modals/HabitEditorModal";
import GoalEditorModal from "./components/modals/GoalEditorModal";
import MemoryEditorModal from "./components/modals/MemoryEditorModal";
import { useRefreshStatsDaily, useRouteUpdater } from "./components/hooks";

function App() {
  const loading = useAppStore((state) => state.loading);

  useEffect(() => {
    // TODO: Perform authorization logic by sending a request to the API
    if (!loading.auth) return;
    useApiStore.getState().auth(undefined);
  }, [loading.auth]);

  useRouteUpdater();
  useRefreshStatsDaily();

  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        {loading.auth && <OverlayLoader full={true} />}
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
  );
}

export default App;
