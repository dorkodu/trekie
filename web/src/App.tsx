import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Route, useAppStore } from "./stores/appStore";
import OverlayLoader from "./components/loaders/OverlayLoader";
import { useEffect } from "react";
import UpdateSWModal from "./components/modals/UpdateSWModal";

function App() {
  const loading = useAppStore(state => state.loading);

  useEffect(() => {
    // TODO: Perform authorization logic
    const timeout = setTimeout(() => {
      useAppStore.setState(s => { s.loading.auth = false });
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const location = useLocation();

  useEffect(() => {
    let route: Route = "any";

    if (location.pathname.indexOf("/home") !== -1) route = "home";
    else if (location.pathname.indexOf("/explore") !== -1) route = "explore";
    else if (location.pathname.indexOf("/track") !== -1) route = "track";
    else if (location.pathname.indexOf("/community") !== -1) route = "community";
    else if (location.pathname.indexOf("/marketplace") !== -1) route = "marketplace";

    useAppStore.setState(s => { s.route = route; });
  }, [location.pathname]);

  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        {(loading.auth) && <OverlayLoader full={true} />}
        {!loading.auth && <Outlet />}

        {/* Modals */}
        <UpdateSWModal />
      </MantineProvider>

      <ScrollRestoration />
    </>
  )
}

export default App
