"use client"

import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useKanban } from "./kanban-context"
import KanbanColumn from "./kanban-column"
import AddTaskDialog from "./modals/add-task-dialog"
import EditTaskDialog from "./modals/edit-task-dialog"

export default function KanbanBoard() {
  const { state, reorderTaskWithinColumn, moveTaskAcrossColumns } = useKanban()
  const [addOpen, setAddOpen] = useState(false)
  const [editTaskId, setEditTaskId] = useState<string | null>(null)

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    if (destination.droppableId === source.droppableId) {
      reorderTaskWithinColumn(source.droppableId, source.index, destination.index)
    } else {
      moveTaskAcrossColumns(source.droppableId, destination.droppableId, source.index, destination.index, draggableId)
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-pretty">Kanban Board</h1>
          <p className="text-sm text-muted-foreground">Manage tasks across TODO, IN PROGRESS, and DONE.</p>
        </div>
        
        {/* Single add button that controls the dialog */}
        <Button onClick={() => setAddOpen(true)} variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </header>

      <Card className="bg-card p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {state.columnOrder.map((colId) => (
              <KanbanColumn key={colId} columnId={colId} onEditTask={(taskId) => setEditTaskId(taskId)} />
            ))}
          </div>
        </DragDropContext>
      </Card>

      {/* Controlled dialogs mounted once */}
      <AddTaskDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditTaskDialog taskId={editTaskId} open={!!editTaskId} onOpenChange={(open) => !open && setEditTaskId(null)} />
    </section>
  )
}
