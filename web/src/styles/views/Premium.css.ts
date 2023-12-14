import { style } from '@vanilla-extract/css'
import { theme, vanilla } from '../theme'
import { darken, rgba } from '@mantine/core'

export const Banner = {
  Root: style({
    borderRadius: vanilla.radius.lg,
    padding: `${vanilla.spacing.lg} ${vanilla.spacing.lg}`,
    maxWidth: 1000,
    backgroundImage: `radial-gradient( circle farthest-corner at 10% 20%,  rgba(37,145,251,0.98) 0.1%, rgba(0,7,128,1) 99.8% )`,
    margin: `0 auto`
  }),

  Title: style({
    color: "white",
    textShadow: `1px 1px 5px ${vanilla.colors.blue[4]}`,
    letterSpacing: -0.75,
    lineHeight: 1.1,
    fontWeight: 800,
    fontSize: 28
  }),

  Text: style({
    color: vanilla.colors.blue[0],
    lineHeight: 1.25,
    fontSize: 18,
    textShadow: `1px 1px 2px ${vanilla.colors.blue[9]}`,
  }),


  Button: style({
    maxWidth: 300,
    background: "white",
    boxShadow: `0 0 3px ${vanilla.colors.blue[9]}`,
    color: vanilla.colors.blue[8],
    fontWeight: 700,
    border: 0,
    borderBottom: `5px solid ${vanilla.colors.blue[2]}`,
  })
}
