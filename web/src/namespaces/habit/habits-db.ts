import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { db } from "@web/lib/db"
import { IHabit } from "./index"

// Query hooks for habits using TanStack Query with Dexie
export const useHabits = (userId?: string) => {
  return useQuery({
    queryKey: ['habits', userId],
    queryFn: async () => {
      if (userId) {
        return db.habits.where('userId').equals(userId).toArray()
      }
      return db.habits.toArray()
    },
    enabled: !!userId,
  })
}

export const useHabit = (id: string) => {
  return useQuery({
    queryKey: ['habit', id],
    queryFn: () => db.habits.get(id),
    enabled: !!id,
  })
}

export const useHabitsCount = () => {
  return useQuery({
    queryKey: ['habits', 'count'],
    queryFn: () => db.habits.count(),
  })
}

// Mutation hooks for habits
export const useCreateHabit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (habit: IHabit) => db.habits.add(habit, habit.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}

export const useUpdateHabit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<IHabit> }) =>
      db.habits.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['habit'] })
    },
  })
}

export const useDeleteHabit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => db.habits.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['habit'] })
    },
  })
}