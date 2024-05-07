import trekie from "@/shared/lib/trekie";
import { vanilla } from "@/styles/theme";
import { IGoal } from "@core/commons/goal";
import { ActionIcon, Alert, Badge, Card, Group, Progress, SimpleGrid, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { IconDiamond, IconDiamondsFilled, IconDots, IconDotsDiagonal, IconDotsVertical, IconHourglass, IconMenu2, IconNorthStar, IconProgress, IconProgressCheck, IconRings, IconSparkles, IconTarget, IconTargetArrow, IconTargetOff, IconTrendingUp } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import GoalMenu from "./GoalMenu";

interface Props {
  id: IGoal["id"]
}

export default function GoalCard({ id }: Props) {
  const goal = useLiveQuery(() => trekie.goal.get(id), [id])
  if (!goal) return GoalNotFound

  let progress = (goal.xpCurrent / goal.xpTarget) * 100

  return (
    <Card withBorder shadow="xs" p="sm">
      <Group wrap="nowrap" justify="space-between" align="flex-start">
        <Stack gap={0}>
          <Text fw={600}>{goal.title}</Text>
          <Text size="sm">{goal.description}</Text>
        </Stack>

        <GoalMenu goal={goal} />
      </Group>

      <SimpleGrid cols={{ base: 2 }} mt={4}>
        <Group gap={4} align="center">
          <Progress.Root
            color="blue"
            radius="lg"
            size={20}
            w="100%"
          >
            <Tooltip
              arrowOffset={5}
              label={`${progress}%`}
              arrowSize={6}
              arrowRadius={2}
              withArrow
            >
              <Progress.Section color="blue" value={progress} />
            </Tooltip>
          </Progress.Root>
        </Group>

        <Badge size="lg" variant="light" color="blue">
          <Group>
            <IconDiamond size={22} />
            <Text fz={12} lh={24} fw={700}>{goal.xpCurrent}/{goal.xpTarget}</Text>
          </Group>
        </Badge>
      </SimpleGrid>
    </Card>
  )
}

const GoalNotFound = (
  <Alert title="Oops!">
    Goal not found.
  </Alert>
)