import { KanbanProvider } from "@/components/kanban/kanban-context"
import KanbanBoard from "@/components/kanban/kanban-board"

export default function Page() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl p-4 md:p-6 relative">
      <KanbanProvider>
        <KanbanBoard />
      </KanbanProvider>
    </main>
  )
}
