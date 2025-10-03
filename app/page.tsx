import { KanbanProvider } from "@/components/kanban/kanban-context"
import KanbanBoard from "@/components/kanban/kanban-board"

export default function Page() {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <KanbanProvider>
        <KanbanBoard />
      </KanbanProvider>
    </main>
  )
}
