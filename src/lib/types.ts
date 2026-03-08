import { Tables } from "@/integrations/supabase/types";

export type Task = Tables<"tasks">;
export type TaskComment = Tables<"task_comments">;
export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export const COLUMN_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "hsl(225, 12%, 56%)" },
  todo: { label: "A Fazer", color: "hsl(252, 85%, 60%)" },
  in_progress: { label: "Em Andamento", color: "hsl(38, 95%, 52%)" },
  review: { label: "Revisão", color: "hsl(285, 72%, 56%)" },
  done: { label: "Completo", color: "hsl(152, 76%, 42%)" },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "Baixa", color: "hsl(152, 76%, 42%)" },
  medium: { label: "Média", color: "hsl(38, 95%, 52%)" },
  high: { label: "Alta", color: "hsl(14, 90%, 58%)" },
  urgent: { label: "Urgente", color: "hsl(0, 84%, 60%)" },
};
