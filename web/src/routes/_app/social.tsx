import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/social')({
  component: Social,
})

import { Badge } from "@web/components/ui/badge";
import { Card } from "@web/components/ui/card";
import { Flex, Group, Stack } from "@web/components/ui/layout";
import { Text } from "@web/components/ui/text";
import { trekie } from "@web/lib/trekie";
import { habits } from "@web/namespaces/habit";
import { useLiveQuery } from "dexie-react-hooks";
import { useFeature } from "flagged";

function Social() {
  const isPremium = useFeature("premium");
  return (
    <Flex direction="column" className="m-4">
      {isPremium
        ? <NewsFeed />
        : <div className="text-center text-muted-foreground">Upgrade to Premium to unlock the News Feed!</div>
      }
    </Flex>
  );
}

export default Social;

function NewsFeed() {
  const userId = trekie.use($ => $.user.id);
  const records =
    useLiveQuery(
      () => trekie.db.commitRecords.where("userId").equals(userId).reverse().sortBy("timestamp"),
      [userId]
    ) || [];

  return (
    <div style={{ borderRadius: 20, padding: 6 }}>
      {records.length === 0 ? (
        <Text className="text-center my-2 text-muted-foreground">
          Nothing to see here yet.
        </Text>
      ) : (
        <Stack gap={8} className="w-full">
          {records.map(record => (
            <CommitActivityCard key={record.id} record={record} />
          ))}
        </Stack>
      )}
      <Flex className="mt-4">
        <Badge variant="secondary" className="mx-auto">
          Your Activities
        </Badge>
      </Flex>
    </div>
  );
}

function CommitActivityCard({ record }: { record: any }) {
  return (
    <Card className="shadow-sm p-2 rounded-lg border w-full mb-2">
      <Stack gap={2}>
        {/* Row 1: kind, event, timestamp */}
        <Group gap={12} wrap="nowrap">
          <Text size="xs" className="text-muted-foreground font-semibold">
            {record.kind}
          </Text>
          <Text size="xs" className="font-semibold">
            {record.event}
          </Text>
          <Text size="xs" className="text-muted-foreground">
            {new Date(record.timestamp).toUTCString()}
          </Text>
        </Group>
        {/* Row 2: title */}
        <div>
          <CommitmentInstanceTableCell kind={record.kind} instanceId={record.instanceId} />
        </div>
        {/* Row 3: rewards */}
        <div>
          <Text size="xs">
            XP {record.reward?.xp ?? 0}, Coins {record.reward?.coins ?? 0}
          </Text>
        </div>
        {/* Row 4: data code block */}
        {record.data ? (
          <pre className="bg-muted text-xs rounded p-2 max-w-[400px] w-full overflow-x-auto">
            {JSON.stringify(record.data)}
          </pre>
        ) : null}
      </Stack>
    </Card>
  );
}

function CommitmentInstanceTableCell({ kind, instanceId }: { kind: string; instanceId: string }) {
  const entity = useLiveQuery(() => {
    switch (kind) {
      case "Habit":
        return habits.getByCommitmentId(instanceId);
      default:
        return null;
    }
  }, [kind, instanceId]);

  if (!entity)
    return (
      <Text size="sm" className="text-muted-foreground">
        {kind} not found
      </Text>
    );
  return <Text size="sm">{entity.title || entity.id}</Text>;
}
