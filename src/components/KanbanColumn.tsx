import { Task, TaskStatus, COLUMN_CONFIG } from "@/lib/types";
import { Droppable } from "@hello-pangea/dnd";
import { KanbanCard } from "./KanbanCard";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onCardClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function KanbanColumn({ status, tasks, onCardClick, onAddTask }: KanbanColumnProps) {
  const config = COLUMN_CONFIG[status];

  return (
    <div className="flex w-72 min-w-[288px] flex-col rounded-xl bg-kanban-column/50 p-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: config.color }} />
          <span className="font-display text-sm font-semibold text-foreground">
            {config.label}
          </span>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-secondary px-1.5 text-[11px] font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Cards */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-scroll flex min-h-[120px] flex-1 flex-col gap-2 overflow-y-auto rounded-lg p-1 transition-colors ${
              snapshot.isDraggingOver ? "bg-accent/50" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={index}
                onClick={onCardClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
