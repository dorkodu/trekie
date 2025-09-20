import { IconCheck, IconCircle, IconClock } from "@tabler/icons-react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Alert, AlertDescription, AlertTitle } from "@web/components/ui/alert";
import { Badge } from "@web/components/ui/badge";
import { Button } from "@web/components/ui/button";
import { Card } from "@web/components/ui/card";
import { Skeleton } from "@web/components/ui/skeleton";

import React from "react";

import { ITodo } from "@web/namespaces/todo";
import { todos } from ".";

interface Props {
  id: ITodo["id"];
  compact?: boolean;
}

export default function TodoCard({ id, compact = false }: Props) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const handleCardClick = () => {
    navigate({ to: "/todo/$todoId", params: { todoId: todo.id } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
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
    <Card
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`Todo ${todo.title}`}
      className="bg-transparent border-0 overflow-visible mb-1 shadow-none p-0 cursor-pointer hover:shadow-none transition-all duration-200"
      tabIndex={0}
    >
      <div className="flex flex-row items-stretch min-h-16 rounded-2xl overflow-hidden">
        {/* Checkbox Button - Full Height Left */}
        <Button
          className="rounded-none rounded-l-2xl flex items-center justify-center px-1.5 min-w-0 bg-transparent hover:bg-transparent transition-all duration-200 hover:scale-105"
          style={{
            height: "auto",
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleToggle(!todo.completed);
          }}
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-md p-0.5 transition-all ${todo.completed
            ? 'bg-blue-500'
            : 'bg-gray-200 dark:bg-gray-700'
            }`}>
            {todo.completed && <IconCheck stroke={2.5} className="size-7 text-white" />}
          </div>
        </Button>

        {/* Main Content */}
        <div className="flex flex-col flex-1 justify-center py-1.5 pl-1.5 pr-1 min-w-0 bg-transparent rounded-r-2xl">
          <div className="flex flex-row justify-between items-center">
            <div className="grid grid-rows-1 min-w-0">
              <h5 className={`truncate font-bold text-base leading-tight ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                {todo.title}
              </h5>
            </div>
          </div>

          {todo.description && !compact && (
            <div>
              <span className="text-sm leading-tight text-muted-foreground">
                {todo.description}
              </span>
            </div>
          )}

          <div className="flex flex-row gap-2 mt-0 justify-between">
            <div className="flex flex-row gap-3 items-start">
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
      </div>
    </Card>
  );
}

function TodoCardSkeleton() {
  return (
    <Card className="bg-transparent border-0 overflow-visible mb-2 shadow-md dark:shadow-lg p-0">
      <div className="flex flex-row items-stretch min-h-20 rounded-2xl overflow-hidden">
        {/* Checkbox Button Skeleton */}
        <Skeleton className="rounded-none rounded-l-2xl w-12 h-auto" />

        {/* Main Content Skeleton */}
        <div className="flex flex-col flex-1 justify-center py-3 pl-3 pr-2 min-w-0 bg-white/5 dark:bg-black/10 ring-1 ring-black/5 dark:ring-white/10 rounded-r-2xl">
          <div className="flex flex-row justify-between items-center">
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-3 w-5/6" />
          </div>
          <div className="flex flex-row gap-2 mt-1.5 justify-between pt-1">
            <div className="flex flex-row gap-3 items-start">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </div>
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
