"use client"

import { Draggable } from "@hello-pangea/dnd"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil } from "lucide-react"
import { useKanban, type Task } from "./kanban-context"

export default function TaskCard({
  task,
  index,
  onEdit,
}: {
  task: Task
  index: number
  onEdit: () => void
}) {
  const { deleteTask } = useKanban()

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-2">
          <Card
            className={[
              "border-border bg-card p-3 transition-colors",
              snapshot.isDragging
                ? "ring-2 ring-primary"
                : "hover:bg-accent/40 focus-within:ring-2 focus-within:ring-ring",
            ].join(" ")}
            role="button"
            aria-label={`Task: ${task.title}`}
            onDoubleClick={onEdit}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onEdit()
              }
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-pretty">{task.title}</h3>
                {task.description ? (
                  <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{task.description}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button size="icon" variant="ghost" onClick={onEdit} aria-label="Edit task">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => deleteTask(task.id)} aria-label="Delete task">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  )
}
