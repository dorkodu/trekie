import { ActionIcon, Box, Group, Image, useMantineColorScheme } from "@mantine/core"
import { UserButton } from "../buttons/UserButton"
import trekie from "@/shared/lib/trekie"
import { useAppStore } from "@/shared/stores/appStore"
import { IconBell, IconMenu2, IconNotification } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"

export function Header() {
  const { colorScheme } = useMantineColorScheme()
  const user = trekie.game($ => $.user)
  const menu = useAppStore($ => $.menu)
  const navigate = useNavigate()

  return (
    <Box m={10} mx="sm">
      <Group justify="space-between">
        <div>
          <Image
            src={
              colorScheme == 'light'
                ? '/images/trekie_Brand.svg'
                : '/images/trekie_Brand_White.svg'
            }
            h={50}
          />
        </div>
        <Group gap={4}>
          <UserButton
            user={{
              avatar: user?.pictureUrl,
              name: user?.name,
              username: user?.username,
            }}
            onClick={() => navigate('/me')}
            compact
          />
          <ActionIcon size="xl" radius="lg" variant="subtle" color="default">
            <IconBell />
          </ActionIcon>
          <ActionIcon size="xl" radius="lg" variant="subtle" color="default">
            <IconMenu2 />
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  )
}