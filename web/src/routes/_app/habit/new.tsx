import { IconArrowLeft } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';

import { Button } from '@web/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@web/components/ui/card';
import HabitForm from '@web/namespaces/habit/HabitForm';

export const Route = createFileRoute('/_app/habit/new')({
  component: HabitNew,
});

function HabitNew() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-4"
        >
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Create New Habit</h1>
          <p className="text-muted-foreground">
            Build a positive habit that will help you grow and achieve your goals.
          </p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Habit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <HabitForm />
        </CardContent>
      </Card>
    </div>
  );
}
