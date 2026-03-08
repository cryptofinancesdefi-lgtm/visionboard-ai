import { Tables } from "@/integrations/supabase/types";

export type Task = Tables<"tasks">;
export type TaskComment = Tables<"task_comments">;
export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export const COLUMN_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "hsl(220, 10%, 46%)" },
  todo: { label: "A Fazer", color: "hsl(245, 58%, 51%)" },
  in_progress: { label: "Em Andamento", color: "hsl(38, 92%, 50%)" },
  review: { label: "Revisão", color: "hsl(280, 67%, 52%)" },
  done: { label: "Completo", color: "hsl(152, 69%, 41%)" },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "Baixa", color: "hsl(152, 69%, 41%)" },
  medium: { label: "Média", color: "hsl(38, 92%, 50%)" },
  high: { label: "Alta", color: "hsl(14, 89%, 55%)" },
  urgent: { label: "Urgente", color: "hsl(0, 84%, 60%)" },
};
