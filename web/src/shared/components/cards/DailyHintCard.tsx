import { Button, Card, Group, Text, ThemeIcon, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconBook, IconBulb, IconProgressHelp, IconVocabulary } from "@tabler/icons-react";
import { useState } from "react";

interface Props { }

function getDailyHint() {
  let hints = [
    "Break down large tasks into smaller, manageable goals. Each milestone achieved can be celebrated like a level-up in a game. ",
    "Assign points for completing tasks or meeting deadlines. Accumulate points to earn rewards or unlock new opportunities.",
    "Design tasks as quests or challenges with clear objectives and rewards. This can make mundane tasks feel more engaging.",
    "Award badges for achieving specific milestones or demonstrating certain behaviors. This provides a sense of accomplishment and recognition.",
    "Encourage productivity by rewarding employees who complete tasks within a set time frame.",
    "Provide immediate feedback on task performance and progress. This helps maintain motivation and allows for adjustments.",
    "Create a tiered reward system where employees can exchange points for tangible rewards or privileges.",
    "Encourage teamwork by setting group goals and rewarding collective achievements.",
    "Add fun elements like avatars, storylines, or virtual worlds to make the work environment more enjoyable and engaging.",
    "Keep the gamification elements dynamic and interesting by regularly updating challenges, rewards, and goals."
  ]

  return hints[Math.floor(Math.random() * hints.length)]
}

export function DailyHintCard({ }: Props) {
  let hint = getDailyHint()

  return (
    <Card withBorder my={10} radius="lg" p="xs">
      <Group gap="sm" justify="space-between">
        <Title order={3} size={18} fw={700}>Hint</Title>

        <ThemeIcon size="lg" variant="light">
          <IconProgressHelp />
        </ThemeIcon>
      </Group>

      <Text size="sm" mt="md">{hint}</Text>
    </Card>
  )
}