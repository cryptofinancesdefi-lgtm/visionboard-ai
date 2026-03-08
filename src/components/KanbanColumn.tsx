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
    <div className="flex w-72 min-w-[288px] flex-col rounded-xl bg-kanban-column/60 backdrop-blur-sm p-3 border border-border/50">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1 ring-offset-kanban-column"
            style={{ backgroundColor: config.color, boxShadow: `0 0 8px ${config.color}40` }}
          />
          <span className="font-display text-sm font-semibold text-foreground">
            {config.label}
          </span>
          <span
            className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white"
            style={{ backgroundColor: config.color }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:scale-110"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Colored top border accent */}
      <div className="h-0.5 rounded-full mb-2 opacity-60" style={{ backgroundColor: config.color }} />

      {/* Cards */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-scroll flex min-h-[120px] flex-1 flex-col gap-2 overflow-y-auto rounded-lg p-1 transition-colors ${
              snapshot.isDraggingOver ? "bg-accent/60 ring-2 ring-primary/20" : ""
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
