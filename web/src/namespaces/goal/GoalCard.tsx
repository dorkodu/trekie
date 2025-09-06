import { IconSparkles } from "@tabler/icons-react";
import { IGoal } from "@web/namespaces/goal";
import GoalMenu from "./GoalCardMenu";

import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@web/components/ui/alert";
import { Badge } from "@web/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { Progress } from "@web/components/ui/progress";
import { goals } from ".";

interface Props {
  id: IGoal["id"];
}

export default function GoalCard({ id }: Props) {
  const goalQuery = useQuery({
    queryKey: ["goal", id],
    queryFn: () => goals.get(id),
  })

  const progressQuery = useQuery({
    queryKey: ["goal-progress", id],
    queryFn: () => goals.calculateProgress(id),
    enabled: !!goalQuery.data,
  })

  if (!goalQuery.data) return NotFound;

  const percentage = progressQuery.data?.percent ?? 0;
  const xp = progressQuery.data?.xp ?? 0;
  const goal = goalQuery.data

  return (
    <Card className="shadow-sm rounded-lg cursor-pointer" onClick={() => { window.location.href = `/goals/${id}` }}>
      <CardHeader className="flex flex-row items-start justify-between p-4">
        <div className="space-y-0">
          <CardTitle className="font-semibold">{goal.title}</CardTitle>
          <CardDescription className="text-sm">
            {goal.description}
          </CardDescription>
        </div>
        <GoalMenu goal={goal} />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mt-1 flex items-center gap-2">
          <div className="relative w-1/4 min-w-[100px] h-6">
            <Progress value={percentage} className="h-full w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-xs font-medium text-white"
                style={{ textShadow: "0 0 4px rgba(0,0,0,0.5)" }}
              >
                {percentage}%
              </span>
            </div>
          </div>
          <Badge variant="secondary" className="pl-2">
            <div className="flex items-center gap-1.5">
              <IconSparkles size={16} />
              <span className="text-xs font-bold">
                {xp}/{goal.xpTarget}
              </span>
            </div>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

const NotFound = (
  <Alert>
    <AlertTitle>Oops!</AlertTitle>
    <AlertDescription>Goal not found.</AlertDescription>
  </Alert>
);

const EmptyState = (
  <Alert>
    <AlertTitle>Oops!</AlertTitle>
    <AlertDescription>Goal not found.</AlertDescription>
  </Alert>
);

const ErrorState = (
  <Alert>
    <AlertTitle>Oops!</AlertTitle>
    <AlertDescription>Goal not found.</AlertDescription>
  </Alert>
);
