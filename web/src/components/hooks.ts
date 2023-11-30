import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useTrekieStore } from "#/stores/trekieStore";
import { Route, useAppStore } from "#/stores/appStore";

export function useDelay(delay: number = 100) {
  const [state, setState] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setState(false), delay);
    return () => clearTimeout(timeout);
  }, []);

  return state;
}

export function useRouteUpdater() {
  const location = useLocation();

  useEffect(() => {
    let route: Route = "any";

    if (location.pathname.indexOf("/home") !== -1) route = "home";
    else if (location.pathname.indexOf("/explore") !== -1) route = "explore";
    else if (location.pathname.indexOf("/life") !== -1) route = "life";
    else if (location.pathname.indexOf("/community") !== -1)
      route = "community";
    else if (location.pathname.indexOf("/market") !== -1) route = "market";
    else if (location.pathname.indexOf("/premium") !== -1) route = "premium";
    else if (location.pathname.indexOf("/archive") !== -1) route = "archive";
    else if (location.pathname.indexOf("/settings") !== -1) route = "settings";

    useAppStore.setState((s) => {
      s.route = route;
    });
  }, [location.pathname]);
}

export function useRefreshStatsDaily() {
  useEffect(() => {
    const task = () => useTrekieStore.getState().updateStats();

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    let interval: NodeJS.Timeout | undefined = undefined;
    let timeout = setTimeout(() => {
      task();
      interval = setInterval(task, 24 * 60 * 60 * 1000);
    }, tomorrow.getTime() - today.getTime());

    return () => {
      clearTimeout(interval);
      clearTimeout(timeout);
    };
  }, []);
}