import { style } from '@vanilla-extract/css'
import { theme, vanilla } from '../theme'

export const Banner = {
  Root: style({
    borderRadius: vanilla.radius.lg,
    padding: `${vanilla.spacing.xl} ${vanilla.spacing.md}`,
    maxWidth: 1000,
    backgroundImage: `radial-gradient( circle farthest-corner at 10% 20%,  rgba(37,145,251,0.98) 0.1%, rgba(0,7,128,1) 99.8% )`
  }),
}
