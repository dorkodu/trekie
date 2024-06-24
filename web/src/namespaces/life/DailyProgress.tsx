import { Center, Divider, MantineColor, Overlay, Progress, Stack, Text, Tooltip } from '@mantine/core'
import { format } from "@/shared/utils/format"
import { vanilla } from '@/styles/theme'

export function DailyProgress({ value }: { value: number }) {
  let color: MantineColor
  let message: string

  value = value * 100
  let haveProgressToday = value > 0

  if (value > 0 && value < 30) {
    message = 'Bad'
    color = 'red'
  } else if (value >= 30 && value < 45) {
    message = 'Meh'
    color = 'orange'
  } else if (value >= 45 && value < 60) {
    message = 'OK'
    color = 'yellow'
  } else if (value >= 60 && value < 80) {
    message = 'Good'
    color = 'lime'
  } else if (value >= 80 && value < 95) {
    message = 'Great'
    color = 'green'
  } else if (value >= 95) {
    message = 'Awesome!'
    color = 'green'
  } else {
    message = 'Nothing'
    color = 'gray'
  }

  const noProgressToday =
    <Progress.Root color="gray" radius="lg" size={20}>
      <Progress.Section color="gray" striped value={100}>
        <Overlay color="#fff" backgroundOpacity={0} blur={2} zIndex={10}>
          <Center>
            <Text tt="uppercase" lh={"20px"} size="xs" c="white" style={{ textShadow: `1px 1px 5px ${vanilla.colors.dark}` }} fw={500}>NO PROGRESS TODAY</Text>
          </Center>
        </Overlay>
      </Progress.Section>
    </Progress.Root>

  const progressBar =
    <Progress.Root
      color={color}
      radius="lg"
      size={20}
      styles={{ section: { transition: 'width 100ms linear 0s' } }}
    >
      <Tooltip
        label={format.percentage(value)}
        arrowOffset={5}
        arrowSize={6}
        arrowRadius={2}
        withArrow
      >
        <Progress.Section color={color} striped value={value} animated={haveProgressToday}>
          <Overlay color="#fff" backgroundOpacity={0} zIndex={10}>
            <Center>
              <Text size="sm" c="white" style={{ textShadow: `1px 1px 5px ${vanilla.colors.dimmed}` }} fw={500}>{message}</Text>
            </Center>
          </Overlay>
        </Progress.Section>
      </Tooltip>
    </Progress.Root>

  return (
    <Stack gap={2}>
      <Divider label="Your Daily Progress" labelPosition="left" />
      {haveProgressToday ? progressBar : noProgressToday}
    </Stack >
  )
}