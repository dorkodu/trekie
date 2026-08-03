import { IconArrowLeft } from '@tabler/icons-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { Button } from '@web/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@web/components/ui/card';
import HabitForm from '@web/namespaces/habit/HabitForm';
import { habits } from '@web/namespaces/habit/library';

export const Route = createFileRoute('/_app/habit/$habitId/edit')({
  component: HabitEdit,
  loader: async ({ params }) => {
    const habit = await habits.get(params.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    return { habit };
  },
});

function HabitEdit() {
  const navigate = useNavigate();
  const { habitId } = Route.useParams();
  const { habit } = Route.useLoaderData();

  const handleSuccess = () => {
    navigate({ to: `/habit/${habitId}` });
  };

  const handleCancel = () => {
    navigate({ to: `/habit/${habitId}` });
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: `/habit/${habitId}` })}
          className="mb-4"
        >
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Back to Habit
        </Button>

        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Edit Habit</h1>
          <p className="text-muted-foreground">
            Update your habit details and settings.
          </p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Habit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <HabitForm
            habit={habit}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}