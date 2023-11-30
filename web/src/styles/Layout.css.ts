import { style } from '@vanilla-extract/css'
import { vanilla } from './theme'

export const BARHEIGHT = 64

export const WIDESCREEN_MIN = 760
export const WIDESCREEN_MAX = 1200

// Screen breakpoints
const isWideScreen = vanilla.largerThan(WIDESCREEN_MIN)
const isMobile = vanilla.smallerThan(WIDESCREEN_MIN)
const isExtraWide = vanilla.largerThan(WIDESCREEN_MAX)

export const Layout = {
  Root: style({
    'display': 'flex',
    'flexDirection': 'column',

    'width': '100%',
    'maxWidth': 1200,
    'minHeight': '100vh',
    'margin': '0 auto',

    '@media': {
      [isExtraWide]: {
        width: '1200px',
      },
    },

    'selectors': {},
  }),

  SideBar: style({
    'width': '35%',
    'maxWidth': '340px',
    'display': 'none',

    '@media': {
      [isWideScreen]: {
        display: 'block',
      },
    },
  }),

  Main: style({
    'width': '100%',
    'flexGrow': 1,

    '@media': {
      [isWideScreen]: {
        width: '65%',
      },
    },
  }),

  Header: style({
    backgroundColor: '#333',
  }),

  Body: style({
    display: 'flex',
  }),

  Footer: style({
    'display': 'block',
    'maxWidth': WIDESCREEN_MAX,
    'height': BARHEIGHT,

    '@media': {
      [vanilla.largerThan(640)]: {
        display: 'none',
      },
    },
  }),
}

export const BottomBar = style({
  position: 'fixed',
  width: 'calc(100% - 20px)',
  bottom: 0,
  backgroundColor: vanilla.colors.white,
  border: `1px solid ${vanilla.colors.gray[3]}`,
  boxShadow: `0 3px 4px 3px ${vanilla.colors.gray[2]}`,
  borderRadius: 10,
  margin: 10,

  selectors: {
    [vanilla.darkSelector]: {
      backgroundColor: vanilla.colors.dark[8],
      border: `1px solid ${vanilla.colors.dark[9]}`,
      boxShadow: `0 3px 4px 3px ${vanilla.colors.dark[8]}`,
    },
  },
})

export const Header = style({
  width: '100vw',
  position: 'fixed',
  top: 0,
  padding: 10,
  maxWidth: vanilla.breakpoints.lg,
  margin: '0 auto',
  marginBottom: BARHEIGHT,

  backgroundColor: vanilla.colors.white,
  borderBottom: `1px solid ${vanilla.colors.gray[2]}`,
  boxShadow: `0 1px 3px 2px ${vanilla.colors.gray[1]}`,

  selectors: {
    [vanilla.darkSelector]: {
      backgroundColor: vanilla.colors.dark[8],
      borderBottom: `1px solid ${vanilla.colors.dark[9]}`,
      boxShadow: `0 1px 3px 2px ${vanilla.colors.dark[8]}`,
    },
  },

  [vanilla.largerThan(WIDESCREEN_MIN)]: {
    position: 'unset',
    top: 'unset',
    margin: 10,
    marginTop: 16,
    width: 'calc(100% - 20px)',
    border: 0,
    boxShadow: 'unset',
    backgroundColor: 'unset',
  },
})

export const SearchInput = style({
  border: `1px solid ${vanilla.colors.gray[4]}`,
  borderRadius: 16,
  background: vanilla.colors.gray[2],
  color: vanilla.colors.gray[9],

  selectors: {
    [vanilla.darkSelector]: {
      border: `1px solid ${vanilla.colors.gray[4]}`,
      background: vanilla.colors.dark[4],
      color: vanilla.colors.gray[0],
    },

    [`&::placeholder`]: {
      color: vanilla.colors.gray[6],
    },

    [`&::placeholder & ${vanilla.darkSelector}`]: {
      color: vanilla.colors.gray[5],
    },

    [`&:focus`]: {
      border: `1px solid ${vanilla.colors.blue[6]}`,
    },
  },
})



export const Menu = {
  Item: style({
    'borderRadius': 10,
    'padding': 4,

    ':hover': {
      backgroundColor: vanilla.colors.gray.light,
    },
  }),
}
