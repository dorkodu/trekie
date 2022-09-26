import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'styled-components'

import "./i18n";
import Router from './routes/_Router'
import { theme } from './styles/theme'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider theme={theme}>
    <Router />
  </ThemeProvider>
)
