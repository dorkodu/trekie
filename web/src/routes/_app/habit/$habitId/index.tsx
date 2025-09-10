import { IconArrowLeft, IconEdit, IconTrash } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { daystamp } from '@sdk/utils';
import { Badge } from '@web/components/ui/badge';
import { Button } from '@web/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@web/components/ui/card';
import HabitCounter from '@web/namespaces/habit/HabitCounter';
import { habits } from '@web/namespaces/habit/library';

export const Route = createFileRoute('/_app/habit/$habitId/')({
  component: HabitView,
  loader: async ({ params }) => {
    const habit = await habits.get(params.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    return { habit };
  },
});

function HabitView() {
  const navigate = useNavigate();
  const { habitId } = Route.useParams();
  const { habit } = Route.useLoaderData();

  const { data: habitData } = useQuery({
    queryKey: ['habit', habitId],
    queryFn: () => habits.get(habitId),
    initialData: habit,
  });

  if (!habitData) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Habit Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The habit you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate({ to: '/home' })}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const todaysCount = habitData.history.get(daystamp.today()) ?? 0;
  const progressPercentage = habitData.dailyTarget > 0
    ? Math.min((todaysCount / habitData.dailyTarget) * 100, 100)
    : 0;

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/home' })}
          className="mb-4"
        >
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{habitData.title}</h1>
            {habitData.description && (
              <p className="text-muted-foreground text-lg">
                {habitData.description}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate({ to: `/habit/${habitId}/edit` })}
            >
              <IconEdit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm('Are you sure you want to delete this habit?')) {
                  habits.delete(habitId);
                  navigate({ to: '/home' });
                }
              }}
            >
              <IconTrash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Habit Counter Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Track Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <HabitCounter habitId={habitId} />
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {habitData.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Completions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {todaysCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Today's Progress
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {habitData.dailyTarget}
                </div>
                <div className="text-sm text-muted-foreground">
                  Daily Target
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Today's Progress
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Today's Progress</span>
                <span>{todaysCount} / {habitData.dailyTarget}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Status */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Achievement Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {todaysCount >= habitData.dailyTarget ? (
                <>
                  <Badge className="bg-green-100 text-green-800">
                    ✅ Target Achieved!
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Great job! You've completed your daily target.
                  </span>
                </>
              ) : (
                <>
                  <Badge variant="secondary">
                    🎯 In Progress
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {habitData.dailyTarget - todaysCount} more to reach your daily target.
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
