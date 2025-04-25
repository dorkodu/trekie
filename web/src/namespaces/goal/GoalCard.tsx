import { Alert, Badge, Card, Center, Flex, Grid, Group, Overlay, Progress, SimpleGrid, Stack, Text, Tooltip } from "@mantine/core"
import { IconArcheryArrow, IconCalendar, IconCheck, IconCheckbox, IconChecks, IconCheckupList, IconCircleCheck, IconDiamond, IconFlagCheck, IconFlame, IconSparkles, IconTarget, IconTargetArrow } from "@tabler/icons-react"
import { IGoal } from "@web/namespaces/goal"
import { trekie } from "@web/shared/lib/trekie"
import { vanilla } from "@web/styles/theme"
import { useLiveQuery } from "dexie-react-hooks"
import GoalMenu from "./GoalCardMenu"

import { goals } from "."

interface Props {
  id: IGoal["id"]
}

export default function GoalCard({ id }: Props) {
  const goal = useLiveQuery(() => goals.get(id), [id])
  const progress = useLiveQuery(() => goals.calculateProgress(id), [id])
  console.log(progress)

  if (!goal) return GoalNotFound

  const percentage = progress?.percent ?? 0
  const xp = progress?.xp ?? 0

  return (
    <Card shadow="sm" p="sm" radius="lg">

      <Group wrap="nowrap" justify="space-between" align="flex-start">
        <Stack gap={0}>
          <Text fw={600}>{goal.title}</Text>
          <Text size="sm">{goal.description}</Text>
        </Stack>

        <GoalMenu goal={goal} />
      </Group>

      <Flex mt="xs" gap={4} justify="flex-start" align="center" direction="row" wrap="nowrap">
        <Progress.Root color="blue" radius="lg" size={24} miw="25%">
          <Progress.Section color="blue" value={percentage}>
            <Overlay color="#fff" backgroundOpacity={0} zIndex={10}>
              <Center>
                <Text style={{ textShadow: `0 0 4px ${vanilla.colors.dark[4]}`, fontWeight: 500, fontSize: 13, color: "white", lineHeight: "24px", textTransform: "uppercase" }}>
                  {percentage}%
                </Text>
              </Center>
            </Overlay>
          </Progress.Section>
        </Progress.Root>

        <Badge size="lg" variant="light" color="blue" pl={6}>
          <Group gap={6} h="100%" justify="center" align="center">
            <IconSparkles size={22} />
            <Text fz={13} lh="24px" fw={700}>{xp}/{goal.xpTarget}</Text>
          </Group>
        </Badge>
      </Flex>
    </Card>
  )
}

const GoalNotFound = (
  <Alert title="Oops!">
    Goal not found.
  </Alert>
)

const EmptyState = (
  <Alert title="Oops!">
    Goal not found.
  </Alert>
)

const ErrorState = (
  <Alert title="Oops!">
    Goal not found.
  </Alert>
)