import { useState } from "react";
import { Task, TaskStatus, TaskPriority, COLUMN_CONFIG, PRIORITY_CONFIG } from "@/lib/types";
import { useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
}

export function TaskDialog({ open, onOpenChange, task, defaultStatus = "todo" }: TaskDialogProps) {
  const isEditing = !!task;
  const createTask = useCreateTask();
  const updateTaskMut = useUpdateTask();
  const deleteTaskMut = useDeleteTask();

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.due_date ? new Date(task.due_date) : undefined
  );
  const [progress, setProgress] = useState(task?.progress ?? 0);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(task?.tags ?? []);

  // Reset form when task changes
  useState(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus(task?.status ?? defaultStatus);
    setPriority(task?.priority ?? "medium");
    setDueDate(task?.due_date ? new Date(task.due_date) : undefined);
    setProgress(task?.progress ?? 0);
    setTags(task?.tags ?? []);
  });

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      progress,
      tags,
    };

    try {
      if (isEditing) {
        await updateTaskMut.mutateAsync({ id: task.id, updates: payload });
        toast.success("Tarefa atualizada!");
      } else {
        await createTask.mutateAsync(payload);
        toast.success("Tarefa criada!");
      }
      onOpenChange(false);
    } catch {
      toast.error("Erro ao salvar tarefa");
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    try {
      await deleteTaskMut.mutateAsync(task.id);
      toast.success("Tarefa excluída!");
      onOpenChange(false);
    } catch {
      toast.error("Erro ao excluir tarefa");
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Input
            placeholder="Título da tarefa..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-display text-base font-semibold"
          />

          <Textarea
            placeholder="Descrição..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(COLUMN_CONFIG).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Prioridade</label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Data de vencimento</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} locale={ptBR} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Progress */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Progresso: {progress}%
            </label>
            <Slider value={[progress]} onValueChange={([v]) => setProgress(v)} max={100} step={5} />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Tags</label>
            <div className="flex gap-2">
              <Input
                placeholder="Adicionar tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={addTag}>+</Button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground"
                  >
                    {tag}
                    <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          {isEditing && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="mr-1 h-4 w-4" /> Excluir
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSave}>
              {isEditing ? "Salvar" : "Criar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
