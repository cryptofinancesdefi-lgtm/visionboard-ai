import { Tables } from "@/integrations/supabase/types";

export type Task = Tables<"tasks">;
export type TaskComment = Tables<"task_comments">;
export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export const COLUMN_CONFIG: Record<TaskStatus, { label: string; colorVar: string }> = {
  backlog: { label: "Backlog", colorVar: "var(--status-backlog)" },
  todo: { label: "A Fazer", colorVar: "var(--status-todo)" },
  in_progress: { label: "Em Andamento", colorVar: "var(--status-in-progress)" },
  review: { label: "Revisão", colorVar: "var(--status-review)" },
  done: { label: "Completo", colorVar: "var(--status-done)" },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; colorVar: string }> = {
  low: { label: "Baixa", colorVar: "var(--priority-low)" },
  medium: { label: "Média", colorVar: "var(--priority-medium)" },
  high: { label: "Alta", colorVar: "var(--priority-high)" },
  urgent: { label: "Urgente", colorVar: "var(--priority-urgent)" },
};
