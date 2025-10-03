"use client"

import { Droppable } from "@hello-pangea/dnd"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useKanban } from "./kanban-context"
import TaskCard from "./task-card"

export default function KanbanColumn({
  columnId,
  onEditTask,
}: {
  columnId: string
  onEditTask: (taskId: string) => void
}) {
  const { state } = useKanban()
  const column = state.columns[columnId]
  const tasks = column.taskIds.map((id) => state.tasks[id]).filter(Boolean)
  const titleId = `${column.id}-title`

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle id={titleId} className="text-base font-semibold">
          {column.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              role="list"
              aria-labelledby={titleId}
              className={[
                "min-h-24 rounded-md border border-dashed p-2 transition-colors",
                snapshot.isDraggingOver ? "bg-muted/40 border-ring/40" : "bg-background/50 border-border",
              ].join(" ")}
            >
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} onEdit={() => onEditTask(task.id)} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  )
}
