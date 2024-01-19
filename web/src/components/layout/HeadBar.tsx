import { vanilla } from "#/styles/theme";
import { Flex, Paper, ActionIcon, Anchor } from "@mantine/core";
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { Link } from "react-router-dom";

function HeadBar() {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false)
  const isWideScreen = useMediaQuery('(min-width: 768px)')
  const location = useLocation()
  const user = useTrekieStore($ => $.user)

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
      <Paper
        style={{
          borderWidth: 0,
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: vanilla.colors.defaultBorder,
          borderRadius: 0,
        }}
      >
        <Flex align="center" justify="space-between" gap="md" px="md" h={56}>
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
              height={36}
              p={1}
            />
          </Anchor>

          <ActionIcon
            variant="subtle"
            size={32}
            onClick={() => open()}
            c="var(--text-color)"
          >
            <IconMenu2 />
          </ActionIcon>
        </Flex>
      </Paper>
    </Flex>
  )

}
