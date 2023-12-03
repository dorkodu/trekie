import {
  Text,
  Paper,
  Button,
  Stack,
  UnstyledButton,
  Group,
  ThemeIcon,
  Box,
  Divider,
} from '@mantine/core'
import {
  IconHome,
  IconNotes,
  IconPlus,
  IconCompass,
  IconCheckbox,
  IconUsers,
  IconBuildingStore,
} from '@tabler/icons-react'

import { useNavigate } from 'react-router-dom'

import styles from '#/styles/components/NavBar.css'
import Emoji from '../custom/Emoji'

export function NavBar() {
  const navigation = [
    { icon: <Emoji emoji="🏡" size={26} />, text: 'Home', path: '/home' },
    { icon: <Emoji emoji="🌎" size={26} />, text: 'Explore', path: '/explore' },
    { icon: <Emoji emoji="✅" size={26} />, text: 'Life', path: '/life' },
    {
      icon: <Emoji emoji="👥" size={26} />,
      text: 'Community',
      path: '/social',
    },
    { icon: <Emoji emoji="🏪" size={26} />, text: 'Market', path: '/market' },
  ].map($ => (
    <PageLink icon={$.icon} key={$.text} path={$.path}>
      {$.text}
    </PageLink>
  ))

  return (
    <Box p={12}>
      <Stack gap={2} maw={180}>
        {navigation}
      </Stack>

      <Button my={10} size="md" w="100%" leftSection={<IconPlus />} radius="lg">
        New Note
      </Button>
    </Box>
  )
}

const PageLink = ({
  icon = <></>,
  path,
  children,
}: {
  icon?: JSX.Element
  path: string
  children: React.ReactNode
}) => {
  const navigate = useNavigate()

  return (
    <div>
      <UnstyledButton
        onClick={() => navigate(path)}
        className={styles.LinkButton}
      >
        <Group gap={12} align="center">
          {icon}
          <Text fz={16} fw={500} lh={1}>
            {children}
          </Text>
        </Group>
      </UnstyledButton>
    </div>
  )
}
