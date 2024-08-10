import trekie from "@/shared/lib/trekie"
import { IGoal } from "@/core/commons/goal"
import { Alert, Badge, Card, Center, Flex, Grid, Group, Overlay, Progress, SimpleGrid, Stack, Text, Tooltip } from "@mantine/core"
import { IconArcheryArrow, IconCalendar, IconCheck, IconCheckbox, IconChecks, IconCheckupList, IconCircleCheck, IconDiamond, IconFlagCheck, IconFlame, IconSparkles, IconTarget, IconTargetArrow } from "@tabler/icons-react"
import { useLiveQuery } from "dexie-react-hooks"
import GoalMenu from "./GoalCardMenu"
import { vanilla } from "@/styles/theme"

interface Props {
  id: IGoal["id"]
}

export default function GoalCard({ id }: Props) {
  const goal = useLiveQuery(() => trekie.goal.get(id), [id])
  const xp = trekie.game($ => $.xp)

  if (!goal) return GoalNotFound

  let progress = (xp / goal.xpTarget) * 100

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
        <Progress.Root color="blue" radius="lg" size={24} miw="40%">
          <Progress.Section color="blue" value={progress}>
            <Overlay color="#fff" backgroundOpacity={0} zIndex={10}>
              <Center>
                <Text tt="uppercase" lh="24px" fz={13} c="white" style={{ textShadow: `1px 1px 5px ${vanilla.colors.dark}` }} fw={500}>{progress}%</Text>
              </Center>
            </Overlay>
          </Progress.Section>
        </Progress.Root>

        <Badge size="lg" variant="light" color="blue" pl={6}>
          <Group gap={6} h="100%" justify="center" align="center">
            <IconArcheryArrow size={22} />
            <Text fz={13} lh="24px" fw={700}>{goal.xpTarget}</Text>
          </Group>
        </Badge>

        {
          /*
              <Badge size="lg" variant="light" color="green" pl={6}>
                  <Group gap={6} h="100%" justify="center" align="center">
                    <IconChecks size={22} />
                    <Text fz={13} lh="24px" fw={700}>5</Text>
                  </Group>
                </Badge>
        
                <Badge size="lg" variant="light" color="red" pl={6}>
                  <Group gap={6} h="100%" justify="center" align="center">
                    <IconCalendar size={21} />
                    <Text fz={13} lh="24px" fw={700}>30</Text>
                  </Group>
                </Badge>
          
          */
        }
      </Flex>
    </Card>
  )
}

const GoalNotFound = (
  <Alert title="Oops!">
    Goal not found.
  </Alert>
)