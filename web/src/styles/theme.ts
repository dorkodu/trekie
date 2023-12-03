import { Anchor, Button, createTheme } from '@mantine/core'
import { themeToVars } from '@mantine/vanilla-extract'

export const theme = createTheme({
  primaryColor: 'green',
  defaultRadius: 'md',
  cursorType: 'pointer',

  fontFamily: 'Rubik, Roboto, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, Fira Code, monospace',

  components: {
    Anchor: Anchor.extend({
      defaultProps: {
        c: 'blue',
        fw: 450,
      },
    }),
    Button: Button.extend({
      defaultProps: {
        radius: "lg"
      }
    }),
  },
})

export const vanilla = themeToVars(theme)
