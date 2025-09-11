import { IconCheck, IconCircle, IconClock } from "@tabler/icons-react";
import { ITodo } from "@web/namespaces/todo";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Alert, AlertDescription, AlertTitle } from "@web/components/ui/alert";
import { Badge } from "@web/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@web/components/ui/card";
import { Checkbox } from "@web/components/ui/checkbox";
import { Skeleton } from "@web/components/ui/skeleton";

import { todos } from ".";

interface Props {
  id: ITodo["id"];
}

export default function TodoCard({ id }: Props) {
  const queryClient = useQueryClient();

  const todoQuery = useQuery({
    queryKey: ["todo", id],
    queryFn: () => todos.get(id),
  });

  if (todoQuery.isLoading) return <TodoCardSkeleton />;
  if (todoQuery.isError) return ErrorState;
  if (!todoQuery.data) return NotFound;

  const todo = todoQuery.data;
  const isOverdue = todo.dueDate && todo.dueDate < Date.now() && !todo.completed;

  const handleToggle = async (checked: boolean) => {
    await todos.toggle(id);
    // Invalidate and refetch the todo query
    queryClient.invalidateQueries({ queryKey: ["todo", id] });
    // Also invalidate the todos list query with userId
    queryClient.invalidateQueries({ queryKey: ["todos", todo.userId] });
  };

  function priorityBadge() {
    switch (todo.priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        );
      default:
        return null;
    }
  }

  function statusBadge() {
    if (todo.completed) {
      return (
        <Badge variant="secondary" className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20 flex gap-1 items-center">
          <IconCheck size={14} /> Completed
        </Badge>
      );
    }
    if (isOverdue) {
      return (
        <Badge variant="destructive" className="flex gap-1 items-center">
          <IconClock size={14} /> Overdue
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="flex gap-1 items-center">
        <IconCircle size={14} /> Pending
      </Badge>
    );
  }

  return (
    <Link
      to="/todo/$todoId"
      params={{ todoId: todo.id }}
      className="block"
    >
      <Card
        role="link"
        aria-label={`Todo ${todo.title}`}
        className="p-0 group relative shadow-sm rounded-xl cursor-pointer transition-all duration-200 border border-border/60 hover:border-border hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        tabIndex={0}
      >
        <CardHeader className="flex flex-row items-start justify-between gap-3 p-4 pb-2">
          <div className="flex items-start gap-3 flex-1">
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggle}
                className="mt-0.5"
              />
            </div>
            <div className="flex-1 space-y-1 pr-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className={`font-semibold leading-tight line-clamp-1 pr-6 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {todo.title}
                </CardTitle>
              </div>
              {todo.description && (
                <CardDescription className="text-xs text-muted-foreground leading-snug line-clamp-2 min-h-[1.5rem]">
                  {todo.description}
                </CardDescription>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {statusBadge()}
                {priorityBadge()}
                {todo.dueDate && (
                  <Badge variant="outline" className="text-xs">
                    Due: {new Date(todo.dueDate).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

function TodoCardSkeleton() {
  return (
    <Card className="relative shadow-sm rounded-xl">
      <CardHeader className="flex flex-row items-start justify-between gap-3 p-4 pb-2">
        <div className="flex items-start gap-3 flex-1">
          <Skeleton className="h-4 w-4 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

const NotFound = (
  <Alert variant="destructive">
    <AlertTitle>Todo not found</AlertTitle>
    <AlertDescription>The referenced todo doesn't exist or was removed.</AlertDescription>
  </Alert>
);

const ErrorState = (
  <Alert variant="destructive">
    <AlertTitle>Error loading todo</AlertTitle>
    <AlertDescription>There was a problem fetching the todo. Please retry.</AlertDescription>
  </Alert>
);
