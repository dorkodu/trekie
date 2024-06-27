import { Card, Group, Text, ThemeIcon, Title } from "@mantine/core";
import { IconBook, IconBulb, IconProgressHelp, IconVocabulary } from "@tabler/icons-react";

interface Props { }

export function TipAdviceCard({ }: Props) {
  return (
    <Card withBorder my={10} radius="lg" p="xs">
      <Group gap="sm" justify="space-between">
        <Title order={3} size={18} fw={700}>Daily Tip</Title>

        <Text></Text>

        <ThemeIcon size="lg" variant="light">
          <IconProgressHelp />
        </ThemeIcon>
      </Group>
    </Card>
  )
}