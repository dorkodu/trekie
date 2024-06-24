import trekie from "@/shared/lib/trekie"
import { IGoal } from "@/core/commons/goal"
import { Alert, Badge, Card, Center, Flex, Grid, Group, Overlay, Progress, SimpleGrid, Stack, Text, Tooltip } from "@mantine/core"
import { IconCheck, IconCheckbox, IconChecks, IconCheckupList, IconCircleCheck, IconDiamond, IconFlagCheck, IconSparkles } from "@tabler/icons-react"
import { useLiveQuery } from "dexie-react-hooks"
import GoalMenu from "./GoalCardMenu"
import { vanilla } from "@/styles/theme"

interface Props {
  id: IGoal["id"]
}

export default function GoalCard({ id }: Props) {
  const goal = useLiveQuery(() => trekie.goal.get(id), [id])
  if (!goal) return GoalNotFound

  let progress = (goal.xpCurrent / goal.xpTarget) * 100

  return (
    <Card withBorder shadow="sm" p="sm">

      <Group wrap="nowrap" justify="space-between" align="flex-start">
        <Stack gap={0}>
          <Text fw={600}>{goal.title}</Text>
          <Text size="sm">{goal.description}</Text>
        </Stack>

        <GoalMenu goal={goal} />
      </Group>

      <Flex mt="xs" gap="xs" justify="flex-start" align="center" direction="row" wrap="nowrap">
        <Progress.Root color="blue" radius="lg" size={24} w="50%">
          <Progress.Section color="blue" value={progress}>
            <Overlay color="#fff" backgroundOpacity={0} zIndex={10}>
              <Center>
                <Text tt="uppercase" lh="24px" fz={13} c="white" style={{ textShadow: `1px 1px 5px ${vanilla.colors.dark}` }} fw={500}>{progress}%</Text>
              </Center>
            </Overlay>
          </Progress.Section>
        </Progress.Root>

        <Badge size="lg" variant="light" color="green" pl={6}>
          <Group gap="xs" h="100%" justify="center" align="center">
            <IconChecks size={22} />
            <Text fz={12} lh="24px" fw={700}>{goal.xpCurrent}/{goal.xpTarget}</Text>
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