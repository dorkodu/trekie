import { Box, Button, Card, Divider, Image, List, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'

import * as PremiumStyles from '@/styles/views/Premium.css'
import {
  IconAdOff,
  IconMultiplier2x,
  IconUsersGroup,
} from '@tabler/icons-react'

function OnlyPremium() {
  return (
    <>
      <Paper shadow="sm" className={PremiumStyles.Banner.Root}>
        <Stack mb={20}>
          <div><Image src="/images/trekie_SUPER_Badge.svg" h={50} w="auto" /></div>
          <Title className={PremiumStyles.Banner.Title} c="white">
            This feature is only available for premium subscribers :(
          </Title>
          <Text className={PremiumStyles.Banner.Text}>
            Do you like and enjoy Trekie? <b>Support</b> this passionate indie
            team only for <b>price of a coffee.</b>
          </Text>
          <Button size="lg" className={PremiumStyles.Banner.Button}>
            Try 1 Week For Free
          </Button>
        </Stack>
        <Box mt={30}>
          <List spacing="sm">
            {[
              {
                icon: <IconAdOff />,
                title: 'Ad-free',
                description: 'No interruptions, full productivity.',
              },
              {
                icon: <IconMultiplier2x />,
                title: 'Doubled Gains',
                description: 'More coins, XP and items available.',
              },
              {
                icon: <IconUsersGroup />,
                title: 'Groups',
                description: 'Share common goals & habits with friends. Say hello to social productivity boost!',
              },
            ].map($ => (
              <List.Item key={$.title} icon={<ThemeIcon variant="light" c="white" size={36}>{$.icon}</ThemeIcon>}>
                <Text fw={700} c="white" lh={1.1}>{$.title}</Text>
                <Text c="white">{$.description}</Text>
              </List.Item>
            ))}
          </List>
        </Box>
      </Paper>
    </>
  )
}

export default OnlyPremium
