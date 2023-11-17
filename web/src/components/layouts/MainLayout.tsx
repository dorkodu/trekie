import { useAppStore } from "@/stores/appStore";
import { ActionIcon, Anchor, Avatar, Button, Divider, Drawer, Flex, Image, Paper, Text, Title, px, useMantineTheme } from "@mantine/core";
import { IconArchive, IconArrowLeft, IconBuildingStore, IconCashBanknote, IconChecklist, IconChevronRight, IconExternalLink, IconHome, IconMenu2, IconPencilPlus, IconSearch, IconSettings, IconUsers } from "@tabler/icons-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDisclosure } from '@mantine/hooks';
import ColorToggle from "../ColorToggle";
import { useApiStore } from "@/stores/apiStore";
import TextParser from "../util/TextParser";

function MainLayout() {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);

  const route = useAppStore(state => state.route);

  const userId = useApiStore(state => state.userId);
  const users = useApiStore(state => state.users);
  const user = userId ? users[userId] : undefined;

  const closeNavigate = (route: string) => {
    close();
    navigate(route);
  }
  const preventNavigate = (ev: React.MouseEvent, route: string) => {
    ev.preventDefault();
    navigate(route);
  }

  return (
    <>
      <Flex direction="column" pos="fixed" top={0} left={0} right={0} maw={theme.breakpoints.xs} mx="auto" style={{ zIndex: 99 }}>
        <Paper>
          <Flex align="center" justify="space-between" gap="md" px="md" h={64}>

            <ActionIcon
              variant="subtle" size={32} onClick={() => navigate(-1)}
              style={{ visibility: route === "home" ? "hidden" : "visible" }}
            >
              <IconArrowLeft />
            </ActionIcon>

            <Anchor
              underline="never"
              href="/home"
              onClick={(ev) => preventNavigate(ev, "/home")}
            >
              <Flex align="center" gap="xs">
                <Image src="/favicon.svg" width={32} height={32} />
                <Title order={3}>Trekie</Title>
              </Flex>
            </Anchor>

            <ActionIcon variant="subtle" size={32} onClick={() => open()}>
              <IconMenu2 />
            </ActionIcon>

          </Flex>
          <Divider w="100%" />
        </Paper>
      </Flex>

      <Flex direction="column" py={64} left={0} right={0} maw={theme.breakpoints.xs} mx="auto">
        <Outlet />
      </Flex>

      <Flex direction="column" pos="fixed" bottom={0} left={0} right={0} maw={theme.breakpoints.xs} mx="auto" style={{ zIndex: 99 }}>
        <Paper>
          <Divider w="100%" />
          <Flex align="center" justify="center" gap="xs" h={64}>
            <ActionIcon variant="subtle" size={32} onClick={() => navigate("/home")}>
              <IconHome />
            </ActionIcon>
            <ActionIcon variant="subtle" size={32} onClick={() => navigate("/explore")}>
              <IconSearch />
            </ActionIcon>
            <ActionIcon variant="subtle" size={32} onClick={() => navigate("/track")}>
              <IconChecklist />
            </ActionIcon>
            <ActionIcon variant="subtle" size={32} onClick={() => navigate("/community")}>
              <IconUsers />
            </ActionIcon>
            <ActionIcon variant="subtle" size={32} onClick={() => navigate("/marketplace")}>
              <IconBuildingStore />
            </ActionIcon>
          </Flex>
        </Paper>

        <Flex pos="absolute" right={theme.spacing.md} top={-48 - (px(theme.spacing.md) as number)}>
          <ActionIcon radius="xl" size={48}>
            <IconPencilPlus />
          </ActionIcon>
        </Flex>
      </Flex>

      <Drawer
        opened={opened} onClose={close}
        lockScroll={false} position="right"
        title="Trekie - The gamified digital life companion"
      >
        <Flex direction="column" gap="md">

          {user &&
            <Button
              variant="default" p="md" h="auto" styles={{ label: { flex: 1 } }}
              onClick={() => closeNavigate(`/profile/${user.username}`)}
            >
              <Flex align="center" gap="xs" w="100%">
                <Avatar src="/favicon.svg" size={32} />
                <Flex direction="column" align="start" style={{ flex: 1 }}>
                  <Title order={5}><TextParser ids={["emoji"]} text={user.name} /></Title>
                  <Text>@{user.username}</Text>
                </Flex>
                <IconChevronRight />
              </Flex>
            </Button>
          }

          <Button variant="subtle" onClick={() => closeNavigate("/premium")}>
            <IconCashBanknote />
            &nbsp;
            <Title order={5}>Premium</Title>
          </Button>

          <Button variant="subtle" onClick={() => closeNavigate("/archive")}>
            <IconArchive />
            &nbsp;
            <Title order={5}>Archive</Title>
          </Button>

          <Button variant="subtle" onClick={() => closeNavigate("/settings")}>
            <IconSettings />
            &nbsp;
            <Title order={5}>Settings</Title>
          </Button>

          <Button variant="subtle">
            <IconExternalLink />
            &nbsp;
            <Title order={5}>Dorkodu Account</Title>
          </Button>

          <Flex direction="column" align="center">
            <Flex gap="xs">
              <Anchor
                href="/privacy-policy"
                onClick={(ev) => preventNavigate(ev, "/privacy-policy")}
              >
                Privacy Policy
              </Anchor>
              <Anchor
                href="/terms-of-service"
                onClick={(ev) => preventNavigate(ev, "/terms-of-service")}
              >
                Terms of Service
              </Anchor>
              <Anchor
                href="/about"
                onClick={(ev) => preventNavigate(ev, "/about")}
              >
                About
              </Anchor>
            </Flex>

            <Anchor href="https://dorkodu.com" target="_blank">
              Dorkodu © {new Date().getFullYear()}
            </Anchor>
          </Flex >

          <Flex justify="center">
            <ColorToggle />
          </Flex>

        </Flex >
      </Drawer>
    </>
  )
}

export default MainLayout