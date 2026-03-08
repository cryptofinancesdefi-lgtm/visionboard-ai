import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Task, TaskStatus, COLUMN_CONFIG } from "@/lib/types";
import { useTasks, useUpdateTask, useTasksByStatus } from "@/hooks/use-tasks";
import { KanbanColumn } from "./KanbanColumn";
import { TaskDialog } from "./TaskDialog";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function KanbanBoard() {
  const { data: tasks, isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const grouped = useTasksByStatus(tasks);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("todo");
  const [searchQuery, setSearchQuery] = useState("");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as TaskStatus;
    updateTask.mutate({
      id: draggableId,
      updates: { status: newStatus, order: destination.index },
    });
  };

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleAddTask = (status: TaskStatus) => {
    setSelectedTask(null);
    setNewTaskStatus(status);
    setDialogOpen(true);
  };

  const filteredGrouped = Object.fromEntries(
    Object.entries(grouped).map(([status, statusTasks]) => [
      status,
      searchQuery
        ? statusTasks.filter(
            (t) =>
              t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : statusTasks,
    ])
  ) as Record<TaskStatus, Task[]>;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center gap-4 border-b border-border bg-card px-6 py-4">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Kanban Board</h1>
          <p className="text-xs text-muted-foreground">
            {tasks?.length ?? 0} tarefas no total
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9"
            />
          </div>
          <Button onClick={() => handleAddTask("todo")}>
            <Plus className="mr-1 h-4 w-4" /> Nova Tarefa
          </Button>
        </div>
      </header>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-kanban-bg p-6 kanban-scroll">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Carregando...
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full">
              {(Object.keys(COLUMN_CONFIG) as TaskStatus[]).map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={filteredGrouped[status]}
                  onCardClick={handleCardClick}
                  onAddTask={handleAddTask}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        defaultStatus={newTaskStatus}
      />
    </div>
  );
}
