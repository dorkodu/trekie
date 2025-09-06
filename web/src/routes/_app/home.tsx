import { IconCopyCheck, IconTargetArrow } from "@tabler/icons-react";
import { createFileRoute } from '@tanstack/react-router';
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

export const Route = createFileRoute('/_app/home')({
  component: Home,
})

import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@web/components/ui/alert";
import { Badge } from "@web/components/ui/badge";
import { Box, Flex, Stack } from "@web/components/ui/layout";
import { Skeleton } from "@web/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@web/components/ui/tabs";
import { db } from "@web/lib/db";
import { errors } from "@web/lib/errors";
import { trekie } from "@web/lib/trekie";
import GoalCard from "@web/namespaces/goal/GoalCard";
import { default as NoGoalsCard } from "@web/namespaces/goal/NoGoalsCard";
import HabitCounter from "@web/namespaces/habit/HabitCounter";
import NoHabitsCard from "@web/namespaces/habit/NoHabitsCard";
import { DailyStats } from "@web/namespaces/life/DailyStats";

function Home() {
  const user = trekie.use($ => $.user);
  if (!user) {
    errors.handle("NO_SESSION", new Error("Failed to load user in home page."));
    return <Alert><AlertDescription>Failed to load user in home page.</AlertDescription></Alert>;
  }

  const [tab, setTab] = useState("commitments");

  return (
    <Box className="m-2">
      <Stack gap={4}>
        <Box className="mb-6 sm:hidden">
          <DailyStats />
        </Box>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 cursor-pointer rounded-lg ">
            <TabsTrigger value="commitments" className="flex items-center gap-2 cursor-pointer rounded-lg">
              <IconCopyCheck className="w-5 h-5" />
              <span>Commitments</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2 cursor-pointer rounded-lg">
              <IconTargetArrow className="w-5 h-5" />
              <span>Goals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commitments" className="mt-2">
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

  const habitsQuery = useQuery({
    queryKey: ['habits', userId],
    queryFn: async () =>
      db.habits
        .where({ userId: userId })
        .filter(habit => !Object.hasOwn(habit, "isDeleted"))
        .toArray(),
  });

  if (habitsQuery.isLoading)
    return (
      <Box className="h-60">
        <Stack gap={2}>
          <Skeleton className="h-2 rounded-xl" />
          <Skeleton className="h-2 rounded-xl" />
          <Skeleton className="h-2 w-[70%] rounded-xl" />
        </Stack>
      </Box>
    );

  const hasAnyHabits = habitsQuery.isSuccess && habitsQuery.data.length > 0;
  if (!hasAnyHabits) return <NoHabitsCard />;

  return (
    <Box className="rounded-2xl min-h-[150px] max-w-lg">
      <Stack gap={0}>
        {habitsQuery.data.map(habit => (
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
      <Box className="py-2.5 md:hidden">
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
        <Skeleton className="h-2 rounded-xl radius-xl" />
        <Skeleton className="h-2 rounded-xl mt-8 radius-xl" />
        <Skeleton className="h-2 w-[70%] rounded-xl mt-8 radius-xl" />
      </>
    );

  const hasAnyLifeGoals = goals.length > 0;

  if (!hasAnyLifeGoals) return <NoGoalsCard />;

  return (
    <Box style={{ borderRadius: 20, padding: 6 }}>
      <Stack gap="xs">
        {goals.map(goal => (
          <GoalCard id={goal.id} key={goal.id} />
        ))}
      </Stack>
      <Flex className="mt-2">
        <Badge variant="default" color="gray" className="mx-auto">
          Track your goals!
        </Badge>
      </Flex>
    </Box>
  );
}
