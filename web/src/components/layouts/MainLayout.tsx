import { useAppStore } from "@/stores/appStore";
import { ActionIcon, Divider, Flex, Image, Paper, Title, useMantineTheme } from "@mantine/core";
import { IconArrowLeft, IconBuildingStore, IconChecklist, IconHome, IconMenu2, IconSearch, IconUsers } from "@tabler/icons-react";
import { Outlet, useNavigate } from "react-router-dom";

function MainLayout() {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const route = useAppStore(state => state.route);

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

            <Flex align="center" gap="xs">
              <Image src="/favicon.svg" width={32} height={32} />
              <Title order={3}>Trekie</Title>
            </Flex>

            <ActionIcon variant="subtle" size={32}>
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
      </Flex>
    </>
  )
}

export default MainLayout