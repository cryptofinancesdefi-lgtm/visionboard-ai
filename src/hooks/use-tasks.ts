import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/api";
import { Task, TaskStatus } from "@/lib/types";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      updateTask(id, updates),
    onMutate: async ({ id, updates }) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });
      const previous = qc.getQueryData<Task[]>(["tasks"]);
      qc.setQueryData<Task[]>(["tasks"], (old) =>
        old?.map((t) => (t.id === id ? { ...t, ...updates } : t)) ?? []
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) qc.setQueryData(["tasks"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useTasksByStatus(tasks: Task[] | undefined) {
  const grouped: Record<TaskStatus, Task[]> = {
    backlog: [],
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };
  tasks?.forEach((t) => {
    grouped[t.status].push(t);
  });
  return grouped;
}
