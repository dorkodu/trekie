import { ActionIcon, Button, Flex, Group, Paper, Text, px } from "@mantine/core"
import { useNavigate } from "react-router-dom"

import CreateMenu from "@/shared/components/menus/CreateMenu"
import * as LayoutStyles from '@/styles/Layout.css'
import { NavigationBar as styles } from '@/styles/Layout.css'
import { IconPlus } from "@tabler/icons-react"
import { navLinks } from "./Nav"

export function NavigationBar() {
  const navigate = useNavigate()
  const BARHEIGHT = 80

  return (
    <Flex
      direction="column"
      pos="fixed"
      bottom={0}
      left={0}
      right={0}
      mx="auto"
      style={{ zIndex: 99 }}
      hiddenFrom="sm"
      h={BARHEIGHT}
    >
      <Paper h={BARHEIGHT} className={styles.Root}>
        <Group px={10} py={12} gap={4} wrap="nowrap" h={BARHEIGHT} justify="space-between">
          <Group wrap="nowrap" gap={0}>
            {
              navLinks.map(view =>
                <Button
                  variant="subtle"
                  onClick={() => { navigate(view.path) }}
                  key={view.text}
                  // based on current route, change link variant to active 
                  className={LayoutStyles.NavigationBar.Button[location.pathname === view.path ? 'active' : 'plain']}
                >
                  <Flex direction="column" gap={4} align="center">
                    {view.icon}
                    <Text fz={11} fw={500}>{view.text}</Text>
                  </Flex>
                </Button>
              )
            }
          </Group>
          <CreateMenu popupPosition="top">
            <ActionIcon radius="lg" size={50}>
              <IconPlus size={32} />
            </ActionIcon>
          </CreateMenu>
        </Group>
      </Paper>
    </Flex>
  )
}
