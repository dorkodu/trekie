import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import React from "react"
import App from "../App";

const Home = React.lazy(() => import("./Home"));
const NotFound = React.lazy(() => import("./NotFound"));

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="home" />} />

          <Route path="home" element={<Home />} />

          <Route path="404" element={<NotFound />} />

          <Route path="*" element={<Navigate to="404" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router