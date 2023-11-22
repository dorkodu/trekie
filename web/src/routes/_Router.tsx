import React, { Suspense } from "react";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";
import CenterLoader from "@/components/loaders/CenterLoader";
import { util } from "@/lib/util";
import App from "../App";
import RequireAuth from "@/components/util/RequireAuth";

// Lazy routes \\
const Home = React.lazy(util.wait(() => import("./main/Home")));
const Explore = React.lazy(util.wait(() => import("./main/Explore")));
const Life = React.lazy(util.wait(() => import("./main/Life")));
const Community = React.lazy(util.wait(() => import("./main/Community")));
const Market = React.lazy(util.wait(() => import("./main/Market")));

const Profile = React.lazy(util.wait(() => import("./main/Profile")));
const Premium = React.lazy(util.wait(() => import("./main/Premium")));
const Archive = React.lazy(util.wait(() => import("./main/Archive")));
const Settings = React.lazy(util.wait(() => import("./main/Settings")));

const Habits = React.lazy(util.wait(() => import("./main/Habits")));
const Goals = React.lazy(util.wait(() => import("./main/Goals")));
const Memories = React.lazy(util.wait(() => import("./main/Memories")));
const Communities = React.lazy(util.wait(() => import("./main/Communities")));
const Fun = React.lazy(util.wait(() => import("./main/Fun")));

const Join = React.lazy(util.wait(() => import("./other/Join")));
const PrivacyPolicy = React.lazy(util.wait(() => import("./other/PrivacyPolicy")));
const TermsOfService = React.lazy(util.wait(() => import("./other/TermsOfService")));
const About = React.lazy(util.wait(() => import("./other/About")));

const Dashboard = React.lazy(util.wait(() => import("./dashboard/Dashboard")));

const NotFound = React.lazy(util.wait(() => import("./NotFound")));
// Lazy routes \\

// Lazy layouts \\
const MainLayout = React.lazy(util.wait(() => import("../components/layouts/MainLayout")));
const DashboardLayout = React.lazy(util.wait(() => import("../components/layouts/DashboardLayout")));
// Lazy layouts \\

function Page(Component: React.LazyExoticComponent<React.ComponentType<any>>) {
  return (
    <Suspense fallback={<CenterLoader />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Navigate to "/home" on path "/" */}
      <Route index element={<Navigate to="/home" />} />

      <Route element={<RequireAuth />}>
        <Route element={Page(MainLayout)}>
          <Route path="/home" element={Page(Home)} />
          <Route path="/explore" element={Page(Explore)} />
          <Route path="/life" element={Page(Life)} />
          <Route path="/community" element={Page(Community)} />
          <Route path="/market" element={Page(Market)} />

          <Route path="/profile/:username" element={Page(Profile)} />
          <Route path="/premium" element={Page(Premium)} />
          <Route path="/archive" element={Page(Archive)} />
          <Route path="/settings/*" element={Page(Settings)} />

          <Route path="/habits/:username" element={Page(Habits)} />
          <Route path="/goals/:username" element={Page(Goals)} />
          <Route path="/memories/:username" element={Page(Memories)} />
          <Route path="/communities/:username" element={Page(Communities)} />
          <Route path="/fun" element={Page(Fun)} />
        </Route>

        <Route element={Page(DashboardLayout)}>
          <Route path="/dashboard" element={Page(Dashboard)} />
        </Route>
      </Route>

      <Route path="/privacy-policy" element={Page(PrivacyPolicy)} />
      <Route path="/terms-of-service" element={Page(TermsOfService)} />
      <Route path="/about" element={Page(About)} />

      <Route element={<RequireAuth preventAuthorized />}>
        <Route path="/join" element={Page(Join)} />
      </Route>

      {/* Error routes & catch all */}
      <Route path="/404" element={Page(NotFound)} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Route>
  )
)
