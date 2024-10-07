import { Badge, Button, Card, Flex, Group, Text, Title } from '@mantine/core'
import { IconLayersSelectedBottom, IconMinus, IconPlus } from '@tabler/icons-react'
import { useLiveQuery } from "dexie-react-hooks"
import { MouseEvent } from 'react'

import HabitCounterMenu from '@/namespaces/habit/HabitCounterMenu'
import EnhancedText from '@/shared/components/misc/TextParser'
import { trekie } from "@/shared/lib/trekie"
import { truncate } from '@/styles/shared.css'
import { vanilla } from '@/styles/theme'

import { Component as habits } from '@/namespaces/habit'

interface Props {
  habitId: string
  onClick?: () => void
}

function HabitCounter({ habitId, onClick }: Props) {
  // get the habit yourself, fresh!

  const habit = useLiveQuery(() => habits.get(habitId), [habitId])

  const onChangeCount = (ev: MouseEvent, count: number) => {
    ev.stopPropagation()
    if (!habit) return
    trekie.habit.commit(habitId, count)
  }

  if (!habit) return null

  return (
    <Card
      p={0}
      mb="xs"
      style={{ overflow: 'visible' }}
      onClick={onClick}
      radius="lg"
      shadow="sm">
      <Button.Group mih={80}>
        <Button
          color="green"
          h="auto"
          onClick={ev => onChangeCount(ev, +1)}
          px="xs">
          <Flex
            style={{
              background: 'rgba(255,255,255,0.25)',
              width: 32,
              height: 32,
              display: 'flex',
              justifyItems: 'center',
              alignItems: 'center',
              borderRadius: 8,
              padding: 2,
            }}>
            <IconPlus stroke={2.5} size={28} />
          </Flex>
        </Button>

        <Flex
          direction="column"
          justify="center"
          py="sm"
          pl="sm"
          pr={8}
          style={{
            flex: 1,
          }}
        >
          <Flex justify="space-between" align="center">
            <Flex style={{ display: 'grid', gridTemplateRows: 'auto' }}>
              <Title order={5} className={truncate}>
                <EnhancedText ids={['emoji']} text={habit.title} />
              </Title>
            </Flex>
            <HabitCounterMenu habit={habit} />
          </Flex>

          <Flex style={{ display: 'grid', gridTemplateRows: 'auto' }}>
            <Text truncate size="sm">
              <EnhancedText ids={['emoji', 'url', 'username']} text={habit.description} />
            </Text>
          </Flex>

          <Group gap={8} mt="4">
            <Badge display="block" variant="light" size="lg" color="blue">
              <Text fw={700}>{habit.count}</Text>
            </Badge>
          </Group>
        </Flex>

        <Button
          color="red"
          h="auto"
          onClick={ev => onChangeCount(ev, -1)}
          px="xs"
        >
          <Flex
            style={{
              background: 'rgba(255,255,255,0.25)',
              width: 32,
              height: 32,
              display: 'flex',
              justifyItems: 'center',
              alignItems: 'center',
              borderRadius: 8,
              padding: 2,
            }}
          >
            <IconMinus stroke={2.5} size={28} />
          </Flex>
        </Button>
      </Button.Group>
    </Card>
  )
}

export default HabitCounter
