import { Paper } from '@mantine/core'
import { glassBackground } from '@web/styles/glass.css'
import { PropsWithChildren } from 'react'

export default function GlassCard(x: PropsWithChildren) {
  return (
    <Paper
      shadow="lg"
      py="xs"
      px="md"
      radius="lg"
      className={glassBackground}
      {...x}
    />
  )
}
