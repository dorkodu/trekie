import { vars } from '@/styles/theme';
import { rem } from '@mantine/core';
import { style } from '@vanilla-extract/css';

export const label = style({
  fontWeight: 800,
  fontSize: rem(200),
  color: vars.colors.gray[3],
  lineHeight: 1,

  "@media": {
    [vars.smallerThan("sm")]: {
      fontSize: rem(100),
    },
  },

  "selectors": {
    [vars.darkSelector]: {
      color: vars.colors.dark[4],
    },
  },
});

export const title = style({
  fontWeight: 800,
  fontSize: rem(38),
  color: vars.colors.dark[9],

  "@media": {
    [vars.smallerThan("sm")]: {
      fontSize: rem(32),
    },
  },

  "selectors": {
    [vars.darkSelector]: {
      color: "white",
    },
  },
});

export const description = style({
  maxWidth: rem(450),
  fontWeight: 500,
  textAlign: "center",
  lineHeight: 1,
});
