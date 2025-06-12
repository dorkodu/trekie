import {
  IconCalendar,
  IconChecks
} from "@tabler/icons-react";
import { Card } from "@web/components/ui/card";
import { Group } from "@web/components/ui/layout";
import { goals, IGoal } from "@web/namespaces/goal";
import { useLiveQuery } from "dexie-react-hooks";

interface Props {
  id: IGoal["id"];
}

export default function FeedItemCard({ id }: Props) {
  const goal = useLiveQuery(() => goals.get(id), [id]);
  if (!goal) return ItemNotFound;

  return (
    <Card shadow="sm" p="sm" radius="lg">
      <Group wrap="nowrap" justify="space-between" align="flex-start">
        <Stack gap={0}>
          <Text fw={600}>{goal.title}</Text>
          <Text size="sm">{goal.description}</Text>
        </Stack>
      </Group>

      <Flex
        mt="xs"
        gap={4}
        justify="flex-start"
        align="center"
        direction="row"
        wrap="nowrap"
      >
        <Badge size="lg" variant="light" color="green" pl={6}>
          <Group gap={6} h="100%" justify="center" align="center">
            <IconChecks size={22} />
            <Text fz={13} lh="24px" fw={700}>
              5
            </Text>
          </Group>
        </Badge>

        <Badge size="lg" variant="light" color="red" pl={6}>
          <Group gap={6} h="100%" justify="center" align="center">
            <IconCalendar size={21} />
            <Text fz={13} lh="24px" fw={700}>
              30
            </Text>
          </Group>
        </Badge>
      </Flex>
    </Card>
  );
}

const ItemNotFound = <Alert title="Oops!">Update not found.</Alert>;
