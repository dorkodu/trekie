import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components'
import { Normalize } from 'styled-normalize'

import { registerSW } from 'virtual:pwa-register'

const GlobalStyle = createGlobalStyle`
  body {
    overflow-y: scroll;

    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;

    // Disable highlight on mobile's when clicking
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  * {
    box-sizing: border-box;
  }
`

function App() {
  return (
    <>
      <Normalize />
      <GlobalStyle />
      <Outlet />
    </>
  )
}

export default App;

const updateSW = registerSW({
  onNeedRefresh() { /* show some sh*t */ },
  onOfflineReady() { /* show some sh*t */ },
})