import { IconCopyCheck, IconTargetArrow } from "@tabler/icons-react";

import NoGoalsCard from "@web/namespaces/goal/NoGoalsCard";
import HabitCounter from "@web/namespaces/habit/HabitCounter";
import NoHabitsCard from "@web/namespaces/habit/NoHabitsCard";
import { DailyStats } from "@web/namespaces/life/DailyStats";

import { db } from "@web/lib/db";
import { errors } from "@web/lib/errors";
import { trekie } from "@web/lib/trekie";
import GoalCard from "@web/namespaces/goal/GoalCard";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

// shadcn/ui imports
import { Alert, AlertDescription } from "@web/components/ui/alert";
import { Badge } from "@web/components/ui/badge";
import { Box, Stack } from "@web/components/ui/layout";
import { Skeleton } from "@web/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@web/components/ui/tabs";

function Home() {
  const user = trekie.use($ => $.user);
  if (!user) {
    errors.handle("NO_SESSION", new Error("Failed to load user in home page."));
    return <Alert><AlertDescription>Failed to load user in home page.</AlertDescription></Alert>;
  }

  const [tab, setTab] = useState("habits");

  return (
    <Box className="m-2">
      <Stack gap={4}>
        <Box className="mb-6 sm:hidden">
          <DailyStats />
        </Box>

        {/* Replace SegmentedControl with Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <IconCopyCheck className="w-5 h-5" />
              <span>Commitments</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <IconTargetArrow className="w-5 h-5" />
              <span>Goals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="habits" className="mt-2">
            <CommitmentsFeed />
          </TabsContent>
          <TabsContent value="goals" className="mt-2">
            <GoalsFeed />
          </TabsContent>
        </Tabs>
      </Stack>
    </Box>
  );
}

export default Home;

function CommitmentsFeed() {
  const userId = trekie.use($ => $.user.id);

  const query = useLiveQuery(
    () =>
      db.habits
        .where({ userId: userId })
        .filter(habit => !Object.hasOwn(habit, "isDeleted"))
        .toArray(),
    []
  );

  if (!query)
    return (
      <Box className="h-60">
        <Stack gap={2}>
          <Skeleton className="h-2 rounded-xl" />
          <Skeleton className="h-2 rounded-xl" />
          <Skeleton className="h-2 w-[70%] rounded-xl" />
        </Stack>
      </Box>
    );

  const hasAnyHabits = query?.length > 0;
  if (!hasAnyHabits) return <NoHabitsCard />;

  return (
    <Box className={cn("bg-muted p-1.5 rounded-2xl min-h-[150px]")}>
      <Stack gap={0}>
        {query.map(habit => (
          <HabitCounter habitId={habit.id} key={habit.id} />
        ))}
      </Stack>
      <div className="flex mt-2">
        <Badge variant="secondary" className="mx-auto">
          Check your daily habits!
        </Badge>
      </div>
    </Box>
  );
}

function GoalsFeed() {
  const userId = trekie.use($ => $.user?.id);

  if (!userId)
    return (
      <Box py={10} hiddenFrom="md">
        <NoHabitsCard />
      </Box>
    );

  const goals = useLiveQuery(
    async () => db.goals.where("userId").equals(userId).toArray(),
    [userId]
  );

  if (!goals)
    return (
      <>
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={8} radius="xl" />
        <Skeleton height={8} mt={8} width="70%" radius="xl" />
      </>
    );

  const hasAnyLifeGoals = goals.length > 0;

  if (!hasAnyLifeGoals) return <NoGoalsCard />;

  return (
    <Box style={{ borderRadius: 20, padding: 6 }} className={ContainerSheet}>
      <Stack gap="xs">
        {goals.map(goal => (
          <GoalCard id={goal.id} key={goal.id} />
        ))}
      </Stack>
      <Flex mt="xs">
        <Badge variant="light" color="gray" mx="auto">
          Track your goals!
        </Badge>
      </Flex>
    </Box>
  );
}
