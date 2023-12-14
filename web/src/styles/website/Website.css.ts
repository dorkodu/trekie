import { style } from '@vanilla-extract/css'
import { vanilla } from '../theme'

export const Header = {
  Root: style({}),

  Link: style({}),
}

export const Hero = {
  Title: style({
    fontSize: 32,
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: -0.5,
    color: vanilla.colors.white,
    width: '90%',
    margin: `12px auto`,
    textAlign: 'center',

    selectors: {
      [vanilla.darkSelector]: {
        color: vanilla.colors.black,
      },
    },
  }),
}

export const Footer = {
  Root: style({
    background: vanilla.colors.gray.light,
    borderRadius: vanilla.radius.lg,
    padding: vanilla.spacing.md,
    margin: `${vanilla.spacing.md} ${vanilla.spacing.xs}`,
  }),

  Link: style({
    color: vanilla.colors.green.filled,
    fontWeight: 450,
  }),
}

export const Features = {}

export const ItWorks = {}
