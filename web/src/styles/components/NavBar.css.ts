import { style } from '@vanilla-extract/css'
import { vanilla } from '../theme'

export default {
  Paper: style({
    marginLeft: 7,

    '@media': {
      [vanilla.largerThan('sm')]: {
        padding: vanilla.spacing.sm,
        margin: vanilla.spacing.sm,
        border: `1px solid ${vanilla.colors.gray[4]}`,
        background: vanilla.colors.gray[0],
        boxShadow: `0px 1px 4px 1px ${vanilla.colors.gray[3]}`,

        selectors: {
          [vanilla.darkSelector]: {
            border: `1px solid ${vanilla.colors.dark[4]}`,
            background: vanilla.colors.dark[6],
            boxShadow: `0px 1px 4px 1px ${vanilla.colors.dark[9]}`,
          },
        },
      },
    },
  }),
  LinkButton: style({
    borderRadius: 16,
    padding: '8px 10px',
    paddingRight: '12px',
    display: 'inline-block',

    transitionDuration: '0.1s',

    ':hover': {
      backgroundColor: vanilla.colors.green.light,
      color: vanilla.colors.green.lightColor,
    },
  }),
}
