import { theme, vanilla } from '@/styles/theme'
import {
  SegmentedControl,
  Center,
  useMantineColorScheme,
  MantineSize,
  MantineColorScheme,
  useComputedColorScheme,
  rem,
  Switch,
} from '@mantine/core'
import { IconSun, IconMoon, IconMoonFilled, IconMoonStars } from '@tabler/icons-react'
import { useState } from 'react'

function ColorToggle({ size = 'xs' }: { size?: MantineSize }) {

  const { setColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  })
  const computedColorScheme = useComputedColorScheme("dark")
  const [checked, setChecked] = useState(computedColorScheme == "dark")

  const sunIcon = (
    <IconSun
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={vanilla.colors.gray[6]}
    />
  );

  const moonIcon = (
    <IconMoon
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={vanilla.colors.gray[4]}
    />
  );

  return <Switch
    size={size} color="dark.5" onLabel={moonIcon} offLabel={sunIcon}
    checked={checked}
    onChange={(event) => {
      setChecked(event.currentTarget.checked)
      setColorScheme(event.currentTarget.checked ? "dark" : "light")
    }}
  />

}

export default ColorToggle
