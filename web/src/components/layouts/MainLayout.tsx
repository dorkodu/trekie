import { Route, useAppStore } from "@/stores/appStore";
import { ActionIcon, Anchor, Avatar, Button, Divider, Drawer, Flex, Image, MantineColor, Paper, Text, Title, px, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { IconArchive, IconArrowLeft, IconBuildingStore, IconCashBanknote, IconChecklist, IconChevronRight, IconExternalLink, IconHome, IconMenu2, IconSearch, IconSettings, IconUsers } from "@tabler/icons-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDisclosure } from '@mantine/hooks';
import ColorToggle from "../ColorToggle";
import { useApiStore } from "@/stores/apiStore";
import TextParser from "../util/TextParser";
import CreateMenu from "../menus/CreateMenu";
import { truncate } from "@/styles/shared.css";

function MainLayout() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
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

  const getRouteColor = (_route: Route): MantineColor | undefined => {
    return _route === route ? undefined : "var(--text-color)";
  }

  return (
    <>
      <Flex direction="column" pos="fixed" top={0} left={0} right={0} maw={theme.breakpoints.xs} mx="auto" style={{ zIndex: 99 }}>
        <Paper>
          <Flex align="center" justify="space-between" gap="md" px="md" h={64}>

            <ActionIcon
              variant="subtle" size={32} onClick={() => navigate(-1)}
              style={{ visibility: route === "home" ? "hidden" : "visible" }}
              c="var(--text-color)"
            >
              <IconArrowLeft />
            </ActionIcon>

            <Anchor
              underline="never"
              href="/home"
              onClick={(ev) => preventNavigate(ev, "/home")}
            >
              <Image src={colorScheme === "dark" ? "/brand-light.svg" : "brand-dark.svg"} height={32} />
            </Anchor>

            <ActionIcon variant="subtle" size={32} onClick={() => open()} c="var(--text-color)">
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
          <Button.Group h={64}>
            <Button variant="subtle" c={getRouteColor("home")} p={0} w="20%" h="auto" radius={0} onClick={() => navigate("/home")}>
              <Flex direction="column" align="center">
                <IconHome />
                <Text fz={10}>Home</Text>
              </Flex>
            </Button>
            <Button variant="subtle" c={getRouteColor("explore")} p={0} w="20%" h="auto" onClick={() => navigate("/explore")}>
              <Flex direction="column" align="center">
                <IconSearch />
                <Text fz={10}>Explore</Text>
              </Flex>
            </Button>
            <Button variant="subtle" c={getRouteColor("life")} p={0} w="20%" h="auto" onClick={() => navigate("/life")}>
              <Flex direction="column" align="center">
                <IconChecklist />
                <Text fz={10}>Life</Text>
              </Flex>
            </Button>
            <Button variant="subtle" c={getRouteColor("community")} p={0} w="20%" h="auto" onClick={() => navigate("/community")}>
              <Flex direction="column" align="center">
                <IconUsers />
                <Text fz={10}>Community</Text>
              </Flex>
            </Button>
            <Button variant="subtle" c={getRouteColor("market")} p={0} w="20%" h="auto" radius={0} onClick={() => navigate("/market")}>
              <Flex direction="column" align="center">
                <IconBuildingStore />
                <Text fz={10}>Market</Text>
              </Flex>
            </Button>
          </Button.Group>
        </Paper>

        <Flex pos="absolute" right={theme.spacing.md} top={-48 - (px(theme.spacing.md) as number)}>
          <CreateMenu />
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
                <Avatar src="/assets/avatar.webp" size={32} />
                <Flex direction="column" align="start" style={{ flex: 1 }}>
                  <Flex style={{ display: "grid", gridTemplateColumns: "auto" }}>
                    <Title order={5} className={truncate}><TextParser ids={["emoji"]} text={user.name} /></Title>
                    <Text truncate ta="start">@{user.username}</Text>
                  </Flex>
                </Flex>
                <IconChevronRight style={{ flexShrink: 0 }} />
              </Flex>
            </Button>
          }

          <Button variant="subtle" c={getRouteColor("premium")} p={0} onClick={() => closeNavigate("/premium")}>
            <IconCashBanknote />
            &nbsp;
            <Title order={5}>Premium</Title>
          </Button>

          <Button variant="subtle" c={getRouteColor("archive")} p={0} onClick={() => closeNavigate("/archive")}>
            <IconArchive />
            &nbsp;
            <Title order={5}>Archive</Title>
          </Button>

          <Button variant="subtle" c={getRouteColor("settings")} p={0} onClick={() => closeNavigate("/settings")}>
            <IconSettings />
            &nbsp;
            <Title order={5}>Settings</Title>
          </Button>

          <Button variant="subtle" c="var(--text-color)" p={0}>
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