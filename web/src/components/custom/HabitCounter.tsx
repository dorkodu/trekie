import { util } from '#/lib/util'
import { useTrekieStore } from '#/stores/trekieStore'
import { truncate } from '#/styles/shared.css'
import { IHabit } from '@sdk/types/habit'
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core'
import { IconMinus, IconPlus, IconTargetArrow } from '@tabler/icons-react'
import TextParser from '../util/TextParser'
import { MouseEvent } from 'react'
import Heatmap from './Heatmap'
import HabitMenu from '../menus/HabitMenu'
import Emoji from './Emoji'
import { count } from 'console'
import { vanilla } from '#/styles/theme'

interface Props {
  habitId: number
  onClick?: () => void
}

function HabitCounter({ habitId, onClick }: Props) {
  const habit = useTrekieStore($ => $.getHabits($.userId)[habitId])

  const onChangeCount = (ev: MouseEvent, count: number) => {
    ev.stopPropagation()
    useTrekieStore.getState().trackHabit(habit, count)
  }

  return (
    <Card
      p={0}
      mb="xs"
      style={{ overflow: 'visible' }}
      onClick={onClick}
      radius="lg"
      shadow="sm"
    >
      <Button.Group mih={80}>
        <Button
          color="green"
          h="auto"
          onClick={ev => onChangeCount(ev, +1)}
          px="sm"
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
            <IconPlus stroke={2.5} size={28} />
          </Flex>
        </Button>

        <Flex
          direction="column"
          justify="center"
          px="sm"
          py="xs"
          style={{
            flex: 1,
          }}
        >
          <Flex justify="space-between" align="center">
            <Flex style={{ display: 'grid', gridTemplateRows: 'auto' }}>
              <Title order={5} className={truncate}>
                <TextParser ids={['emoji']} text={habit.title} />
              </Title>
            </Flex>
            <HabitMenu habit={habit} />
          </Flex>

          <Flex style={{ display: 'grid', gridTemplateRows: 'auto' }}>
            <Text truncate size="sm">
              <TextParser
                ids={['emoji', 'url', 'username']}
                text={habit.description}
              />
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
          px="sm"
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
