import { style } from "@vanilla-extract/css";
import { vanilla } from "../theme";

export const Header = {
  Root: style({

  }),

  Link: style({
  })
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
    fontWeight: 450
  })
}

export const Features = {}

export const ItWorks = {}