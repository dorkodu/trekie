import { IconCalendar, IconChecks } from "@tabler/icons-react";
import { Alert, AlertTitle } from "@web/components/ui/alert";
import { Badge } from "@web/components/ui/badge";
import { Card, CardContent } from "@web/components/ui/card";
import { goals, IGoal } from "@web/namespaces/goal";
import { useLiveQuery } from "dexie-react-hooks";

interface Props {
  id: IGoal["id"];
}

export default function FeedItemCard({ id }: Props) {
  const goal = useLiveQuery(() => goals.get(id), [id]);
  if (!goal) return ItemNotFound;

  return (
    <Card className="shadow-sm p-4 rounded-lg">
      <CardContent className="p-0">
        <div className="flex flex-nowrap justify-between items-start">
          <div className="flex flex-col gap-0">
            <h3 className="font-semibold">{goal.title}</h3>
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          </div>
        </div>

        <div className="mt-3 flex gap-1 justify-start items-center">
          <Badge
            variant="outline"
            className="text-xs h-8 pl-3 bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
          >
            <div className="flex gap-1.5 h-full justify-center items-center">
              <IconChecks size={16} />
              <span className="text-xs leading-6 font-bold">
                5
              </span>
            </div>
          </Badge>

          <Badge
            variant="outline"
            className="text-xs h-8 pl-3 bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
          >
            <div className="flex gap-1.5 h-full justify-center items-center">
              <IconCalendar size={16} />
              <span className="text-xs leading-6 font-bold">
                30
              </span>
            </div>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

const ItemNotFound = (
  <Alert>
    <AlertTitle>Oops!</AlertTitle>
    <p>Update not found.</p>
  </Alert>
);
