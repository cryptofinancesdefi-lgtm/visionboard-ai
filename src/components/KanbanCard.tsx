import { Task, PRIORITY_CONFIG } from "@/lib/types";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar, MessageSquare, Flag } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";

interface KanbanCardProps {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
}

export function KanbanCard({ task, index, onClick }: KanbanCardProps) {
  const priorityCfg = PRIORITY_CONFIG[task.priority];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`group cursor-pointer rounded-lg border border-border bg-card p-3.5 transition-all ${
            snapshot.isDragging ? "shadow-card-drag scale-[1.02]" : "shadow-card hover:shadow-card-hover"
          }`}
        >
          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h4 className="font-display text-sm font-semibold leading-snug text-foreground">
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {task.description}
            </p>
          )}

          {/* Progress */}
          {task.progress != null && task.progress > 0 && (
            <div className="mt-2.5 flex items-center gap-2">
              <Progress value={task.progress} className="h-1.5 flex-1" />
              <span className="text-[10px] font-medium text-muted-foreground">
                {task.progress}%
              </span>
            </div>
          )}

          {/* Footer */}
          <div className="mt-3 flex items-center gap-3 text-muted-foreground">
            {/* Priority flag */}
            <div className="flex items-center gap-1">
              <Flag
                className="h-3 w-3"
                style={{ color: `hsl(${priorityCfg.colorVar.replace("var(--priority-", "").replace(")", "")})` }}
                fill="currentColor"
              />
            </div>

            {/* Due date */}
            {task.due_date && (
              <div className="flex items-center gap-1 text-[11px]">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.due_date), "dd MMM", { locale: ptBR })}</span>
              </div>
            )}

            <div className="flex-1" />

            <MessageSquare className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}
