import { Paper, rgba } from '@mantine/core'
import { style } from '@vanilla-extract/css'
import { vanilla } from './theme'

export const wrapContent = style({
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
})

export const truncate = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const glassBackground = style({
  background: rgba('#FFFFFF', 0.5),
  backdropFilter: `blur(2px)`,

  selectors: {
    [vanilla.darkSelector]: {
      backdropFilter: `blur(4px)`,
      background: rgba(vanilla.colors.black, 0.5),
    },
  },
})

export const glassBar = style({
  background: rgba(vanilla.colors.dark[9], 0.6),
  backdropFilter: " blur(10px) saturate(150%);",

  selectors: {
    [vanilla.lightSelector]: {
      background: rgba("#FFFFFF", 0.6),
      backdropFilter: " blur(10px) saturate(150%);",
    },
  },
})