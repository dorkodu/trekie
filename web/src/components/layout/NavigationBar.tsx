const BottomBar = (
  <Flex
    direction="column"
    pos="fixed"
    bottom={0}
    left={0}
    right={0}
    mx="auto"
    style={{ zIndex: 99 }}
    hiddenFrom="sm"
    h={styles.BARHEIGHT}
  >
    <Paper
      style={{
        borderWidth: 0,
        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: vanilla.colors.defaultBorder,
        borderRadius: 0,
      }}
      h={styles.BARHEIGHT}
    >
      {
        navLinks.map(view =>
          <Button
            variant="subtle"
            p={0}
            w="20%"
            h="auto"
            onClick={() => { navigate(view.path); }}
            key={view.text}
            // based on current route, change link variant to active 
            className={styles.NavigationBar.Button[location.pathname === view.path ? 'active' : 'plain']}
            radius={8}
          >
            <Flex direction="column" gap={2} align="center">
              {view.icon}
              <Text fz={11} fw={500}>{view.text}</Text>
            </Flex>
          </Button>
        )
      }
    </Paper>

    <Flex
      pos="absolute"
      right={theme.spacing.md}
      top={-48 - (px(theme.spacing.md) as number)}
    >
      <CreateMenu />
    </Flex>
  </Flex >
)
