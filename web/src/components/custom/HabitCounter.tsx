import { trekie } from "#/lib/trekie"
import { truncate } from '#/styles/shared.css'
import { Badge, Button, Card, Flex, Group, Text, Title } from '@mantine/core'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import TextParser from '../util/TextParser'
import { MouseEvent } from 'react'
import HabitMenu from '../menus/HabitMenu'

interface Props {
  habitId: string
  onClick?: () => void
}

function HabitCounter({ habitId, onClick }: Props) {
  // get the habit yourself, fresh!
  const habit = trekie.game($ => $.habits[habitId])

  const onChangeCount = (ev: MouseEvent, count: number) => {
    ev.stopPropagation()
    if (!habit) return;
    trekie.game.getState().trackHabit(habit, count)
  }

  if (!habit) return null;

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
