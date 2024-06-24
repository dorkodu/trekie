import { useAppStore } from "@/shared/stores/appStore"
import { trekie } from "@/shared/lib/trekie"
import { vanilla } from "@/styles/theme"
import { Flex, Paper, ActionIcon, Anchor, useMantineColorScheme, Image, UnstyledButton } from "@mantine/core"
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { Headbar as styles } from "@/styles/Layout.css"
import { vars } from "@/shared/vars"

export function HeadBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { colorScheme } = useMantineColorScheme()

  const user = trekie.game($ => $.user)
  const menu = useAppStore($ => $.menu)

  const menuButton = <ActionIcon
    variant="subtle"
    color="gray"
    size={32}
    onClick={() => menu.open()}
    c="var(--text-color)"
  ><IconMenu2 /></ActionIcon>

  const returnButton = <ActionIcon
    variant="subtle"
    color="gray"
    size={32}
    onClick={() => navigate(-1)}
    c="var(--text-color)"
  ><IconArrowLeft /></ActionIcon>

  const profileButton = <UnstyledButton onClick={() => navigate("/me")}>
    <Image src={user?.pictureUrl ?? vars.defaultAvatarUrl} width={36} height={36} radius="xl" />
  </UnstyledButton>

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
        <Flex align="center" justify="space-between" gap="md" px="xs" h={60}>
          {location.pathname === '/home' ? menuButton : returnButton}

          <Anchor underline="never" to="/home" component={Link}>
            <Image
              src={
                colorScheme == 'light'
                  ? '/images/trekie_Brand.svg'
                  : '/images/trekie_Brand_White.svg'
              }
              width="auto"
              height={40}
              p={1}
              pl={8}
            />
          </Anchor>

          {location.pathname === '/home' ? profileButton : profileButton}
        </Flex>
      </Paper>
    </Flex >
  )
}
