import { useAppStore } from "@/stores/appStore"
import { trekie } from "@/commons/lib/trekie"
import { vanilla } from "@/styles/theme"
import { Flex, Paper, ActionIcon, Anchor, useMantineColorScheme, Image } from "@mantine/core"
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { Headbar as styles } from "@/styles/Layout.css"

export function HeadBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { colorScheme } = useMantineColorScheme()

  const menu = useAppStore($ => $.menu)

  return (
    <Flex
      direction="column"
      pos="fixed"
      top={0}
      left={0}
      right={0}
      mx="auto"
      style={{ zIndex: 99 }}
      hiddenFrom="sm"
    >
      <Paper className={styles.Root}>
        <Flex align="center" justify="space-between" gap="md" px="xs" h={56}>
          <ActionIcon
            variant="subtle"
            size={32}
            onClick={() => navigate(-1)}
            style={{
              visibility: location.pathname === '/home' ? 'hidden' : 'visible',
            }}
            c="var(--text-color)"
          >
            <IconArrowLeft />
          </ActionIcon>

          <Anchor underline="never" to="/home" component={Link}>
            <Image
              src={
                colorScheme == 'light'
                  ? '/images/trekie_Brand.svg'
                  : '/images/trekie_Brand_White.svg'
              }
              height={40}
              p={1}
            />
          </Anchor>

          <ActionIcon
            variant="subtle"
            color="gray"
            size={32}
            onClick={() => menu.open()}
            c="var(--text-color)"
          >
            <IconMenu2 />
          </ActionIcon>
        </Flex>
      </Paper>
    </Flex >
  )

}
