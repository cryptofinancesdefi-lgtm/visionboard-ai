import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus } from "@/lib/types";

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createTask(task: {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: "low" | "medium" | "high" | "urgent";
  tags?: string[];
  due_date?: string;
}): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...task, order: Date.now() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchComments(taskId: string) {
  const { data, error } = await supabase
    .from("task_comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function addComment(taskId: string, content: string) {
  const { data, error } = await supabase
    .from("task_comments")
    .insert({ task_id: taskId, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}
