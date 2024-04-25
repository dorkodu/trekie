import { Box, Group, Image, useMantineColorScheme } from "@mantine/core";
import { UserButton } from "../buttons/UserButton";
import trekie from "#/commons/lib/trekie";
import { useAppStore } from "#/stores/appStore";

export function Header() {
  const { colorScheme } = useMantineColorScheme()
  const user = trekie.game($ => $.user)
  const menu = useAppStore($ => $.menu)

  return (
    <Box m={10} mx={16}>
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
            onClick={() => menu.open()}
            compact
          />
        </Group>
      </Group>
    </Box>
  )
}