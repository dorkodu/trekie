import { IconAlertTriangle, IconCheck, IconFlag, IconPlayerPause, IconSparkles } from "@tabler/icons-react";
import { IGoal } from "@web/namespaces/goal";
import GoalMenu from "./GoalCardMenu";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Alert, AlertDescription, AlertTitle } from "@web/components/ui/alert";
import { Badge } from "@web/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@web/components/ui/card";
import { Skeleton } from "@web/components/ui/skeleton";

import { goals } from ".";

interface Props {
  id: IGoal["id"];
}

export default function GoalCard({ id }: Props) {
  const navigate = useNavigate();

  const goalQuery = useQuery({
    queryKey: ["goal", id],
    queryFn: () => goals.get(id),
  });

  const progressQuery = useQuery({
    queryKey: ["goal-progress", id],
    queryFn: () => goals.calculateProgress(id),
    enabled: !!goalQuery.data,
  });

  if (goalQuery.isLoading) return <GoalCardSkeleton />;
  if (goalQuery.isError) return ErrorState;
  if (!goalQuery.data) return NotFound;

  const goal = goalQuery.data;
  const percentage = progressQuery.data?.percent ?? 0;
  const xp = progressQuery.data?.xp ?? 0;
  const isComplete = percentage >= 100 || !!goal.completedAt;
  const isGivenUp = !!goal.giveupAt;
  const progressLoading = progressQuery.isLoading;

  function statusBadge() {
    if (isComplete) return (
      <Badge variant="secondary" className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20 flex gap-1 items-center">
        <IconCheck size={14} /> Completed
      </Badge>
    );
    if (isGivenUp) return (
      <Badge variant="secondary" className="bg-rose-600/10 text-rose-600 border-rose-600/20 flex gap-1 items-center">
        <IconPlayerPause size={14} /> On Hold
      </Badge>
    );
    if (percentage >= 75) return (
      <Badge variant="outline" className="border-amber-500/40 text-amber-600 flex gap-1 items-center">
        <IconFlag size={14} /> Near Finish
      </Badge>
    );
    if (percentage === 0) return (
      <Badge variant="outline" className="text-slate-500 flex gap-1 items-center">
        <IconAlertTriangle size={14} /> Not Started
      </Badge>
    );
    return (
      <Badge variant="outline" className="flex gap-1 items-center">
        In Progress
      </Badge>
    );
  }

  return (
    <Card
      role="link"
      aria-label={`Goal ${goal.title} progress ${percentage}%`}
      className="p-0 group relative shadow-sm rounded-xl cursor-pointer transition-all duration-200 border border-border/60 hover:border-border hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      tabIndex={0}
      onClick={() => navigate({ to: '/goal/$goalId', params: { goalId: goal.id } })}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate({ to: '/goal/$goalId', params: { goalId: goal.id } });
        }
      }}
    >

      <CardHeader className="flex flex-row items-start justify-between gap-3 p-4 pb-2">
        <div className="flex-1 space-y-1 pr-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="font-semibold leading-tight line-clamp-1 pr-6">
              {goal.title}
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground leading-snug line-clamp-2 min-h-[1.5rem]">
            {goal.description}
          </CardDescription>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {statusBadge()}
            <Badge variant="secondary" className="pl-2 bg-indigo-600/10 text-indigo-600 border-indigo-600/20">
              <div className="flex items-center gap-1.5">
                <IconSparkles size={14} />
                <span className="text-[11px] font-semibold tracking-wide">{xp}/{goal.xpTarget} XP</span>
              </div>
            </Badge>
          </div>
        </div>
        <GoalMenu goal={goal} />
      </CardHeader>
      <CardContent className="p-4 pt-0 flex flex-col gap-3">
        <div className="flex items-center gap-3" aria-label="Progress bar" aria-busy={progressLoading || undefined}>
          <div className="relative flex-1 h-3 rounded-full overflow-hidden bg-muted/60">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-20" />
            <div
              className={`h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-[width] duration-500 ease-out ${progressLoading ? "animate-pulse" : ""}`}
              style={{ width: progressLoading ? "25%" : `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <span className="w-10 text-right text-xs font-medium tabular-nums" aria-label="Progress percent">{progressLoading ? "--%" : `${percentage}%`}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground uppercase tracking-wide">
          <span>{xp} XP</span>
          <span>{goal.xpTarget} Target</span>
        </div>
      </CardContent>
    </Card>
  );
}

function GoalCardSkeleton() {
  return (
    <Card className="relative shadow-sm rounded-xl">
      <CardHeader className="flex flex-row items-start justify-between gap-3 p-4 pb-2">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </CardHeader>
      <CardContent className="p-4 pt-0 flex flex-col gap-3">
        <Skeleton className="h-3 w-full" />
        <div className="flex justify-between text-[11px]">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}

const NotFound = (
  <Alert variant="destructive">
    <AlertTitle>Goal not found</AlertTitle>
    <AlertDescription>The referenced goal doesn't exist or was removed.</AlertDescription>
  </Alert>
);

const EmptyState = (
  <Alert>
    <AlertTitle>No goals yet</AlertTitle>
    <AlertDescription>Create your first goal to start tracking progress.</AlertDescription>
  </Alert>
);

const ErrorState = (
  <Alert variant="destructive">
    <AlertTitle>Error loading goal</AlertTitle>
    <AlertDescription>There was a problem fetching the goal. Please retry.</AlertDescription>
  </Alert>
);
