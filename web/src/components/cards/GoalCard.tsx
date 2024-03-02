import trekie from "#/lib/trekie";
import { IGoal } from "@core/commons/goal";
import { ActionIcon, Badge, Card, Group, Progress, SimpleGrid, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { IconDots, IconDotsDiagonal, IconDotsVertical, IconHourglass, IconMenu2, IconProgress, IconProgressCheck, IconRings, IconTarget, IconTargetArrow, IconTargetOff, IconTrendingUp } from "@tabler/icons-react";

interface Props {
  id: IGoal["id"]
}

export default function GoalCard({ id }: Props) {
  const goal = trekie.goal.store($ => $.goals[id])
  if (!goal) return GoalNotFound

  let progress = (goal.xpCurrent / goal.xpTarget) * 100

  return (
    <Card withBorder shadow="xs" p="sm">
      <Group justify="space-between" align="flex-start">
        <Stack gap={0}>
          <Text fw={600}>{goal.title}</Text>
          <Text size="sm">{goal.description}</Text>
        </Stack>

        <ActionIcon variant="subtle" color="gray">
          <IconDotsVertical />
        </ActionIcon>
      </Group>

      <SimpleGrid cols={{ base: 2 }}>
        <Group gap={4} align="center">
          <Progress.Root
            color="blue"
            radius="lg"
            size={20}
            w="calc(100% - 30px)"
          >
            <Tooltip
              arrowOffset={5}
              label={`${progress}%`}
              arrowSize={6}
              arrowRadius={2}
              withArrow
            >
              <Progress.Section color="blue" striped value={progress} animated>
                <Progress.Label>{progress}%</Progress.Label>
              </Progress.Section>
            </Tooltip>
          </Progress.Root>
        </Group>

        <Badge size="lg" p={0} variant="light" color="red">
          <Group gap={2}>
            <ThemeIcon color="red" variant="transparent" size={24}><IconTrendingUp size={24} /></ThemeIcon>
            <Text fw={800} c="red" size="sm" mr={6} lh={1}>{goal.xpTarget}</Text>
          </Group>
        </Badge>
      </SimpleGrid>



    </Card>
  )
}

const GoalNotFound = (
  <Card>
    <Text fw={500}></Text>
  </Card>
)