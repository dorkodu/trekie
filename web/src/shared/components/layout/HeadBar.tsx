import { trekie } from "@/shared/lib/trekie"
import { useAppStore } from "@/shared/stores/appStore"
import { vanilla } from "@/styles/theme"
import { ActionIcon, Anchor, Flex, Image, Paper, UnstyledButton, useMantineColorScheme } from "@mantine/core"
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { vars } from "@/shared/vars"
import { Headbar as styles } from "@/styles/Layout.css"

export function HeadBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { colorScheme } = useMantineColorScheme()

  const user = trekie.use($ => $.user)
  const menu = useAppStore($ => $.menu)

  const menuButton = <ActionIcon
    variant="subtle"
    color="gray"
    size={40}
    onClick={() => menu.open()}
    c="var(--text-color)"><IconMenu2 size={26} /></ActionIcon>

  const returnButton = <ActionIcon
    variant="subtle"
    color="gray"
    size={40}
    onClick={() => navigate(-1)}
    c="var(--text-color)"><IconArrowLeft size={26} /></ActionIcon>

  const profileButton = <UnstyledButton onClick={() => navigate("/me")}>
    <Image src={user?.pictureUrl ?? vars.defaultAvatarUrl} width={40} height={40} radius="xl" />
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
