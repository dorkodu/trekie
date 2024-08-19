import { Anchor, Divider, Group, Image, Stack }
  from '@mantine/core'
import { Link, Outlet } from 'react-router-dom'


import * as styles from '@/styles/Layout.css'

export default function FlowLayout() {
  return (
    <div className={styles.Layout.Root}>
      <Stack>
        <main><Outlet /></main>
        <footer>{Footer}</footer>
      </Stack>

    </div>
  )
}

const Footer = (
  <>
    <Divider m={16} mb={0} />

    <Stack gap={0} px={10} align="center">
      <Group justify="center" gap="xs" p={10}>
        {[
          ['About', '/about'],
          ['Terms', '/legal/terms'],
          ['Privacy', '/legal/privacy'],
          ['Careers', 'https://dorkodu.com/jobs'],
          ['Blog', 'https://dorkodu.substack.com'],
        ].map(link => (
          <Anchor
            component={Link}
            //@ts-ignore
            to={link[1]}
            key={link[1]}
            c="dimmed"
            fw={400}
            size="sm"
          >
            {link[0]}
          </Anchor>
        ))}
      </Group>
      <Anchor display="block" href="https://dorkodu.com" target="_blank">
        <Image
          src="/images/dorkodu_Logo_Colorful.svg"
          w={120}
          display="block"
        />
      </Anchor>
    </Stack>
  </>
)