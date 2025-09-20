import { IconCopyCheck, IconTargetArrow } from "@tabler/icons-react";
import { createFileRoute } from '@tanstack/react-router';
import { useState } from "react";

export const Route = createFileRoute('/_app/home')({
  component: Home,
})

import { CommitmentsFeed } from "@web/components/home/CommitmentsFeed";
import { GoalsFeed } from "@web/components/home/GoalsFeed";
import { Alert, AlertDescription } from "@web/components/ui/alert";
import { Box } from "@web/components/ui/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@web/components/ui/tabs";
import { errors } from "@web/lib/errors";
import { trekie } from "@web/lib/trekie";
import { DailyStats } from "@web/namespaces/life/DailyStats";

function Home() {
  const user = trekie.use($ => $.user);
  if (!user) {
    errors.handle("NO_SESSION", new Error("Failed to load user in home page."));
    return <Alert><AlertDescription>Failed to load user in home page.</AlertDescription></Alert>;
  }

  const [tab, setTab] = useState("commitments");
  const [filter, setFilter] = useState<"all" | "habits" | "todos">("all");

  return (
    <div className="m-2">
      <div className="flex flex-col gap-2">
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
            <CommitmentsFeed filter={filter} onFilterChange={setFilter} />
          </TabsContent>
          <TabsContent value="goals" className="mt-2">
            <GoalsFeed />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Home;
