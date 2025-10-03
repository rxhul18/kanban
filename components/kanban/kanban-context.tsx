"use client"

import type React from "react"
import { createContext, useContext, useMemo, useState } from "react"

export type Task = {
  id: string
  title: string
  description?: string
}

export type Column = {
  id: string
  title: string
  taskIds: string[]
}

export type BoardState = {
  tasks: Record<string, Task>
  columns: Record<string, Column>
  columnOrder: string[]
}

type KanbanContextValue = {
  state: BoardState
  addTask: (input: { title: string; description?: string }) => void
  updateTask: (id: string, input: { title: string; description?: string }) => void
  deleteTask: (id: string) => void
  reorderTaskWithinColumn: (columnId: string, startIndex: number, endIndex: number) => void
  moveTaskAcrossColumns: (
    sourceColumnId: string,
    destColumnId: string,
    sourceIndex: number,
    destIndex: number,
    taskId: string,
  ) => void
}

const KanbanContext = createContext<KanbanContextValue | null>(null)

const initialState: BoardState = {
  tasks: {
    "task-1": { id: "task-1", title: "Set up project", description: "Initialize Next.js + Tailwind + shadcn" },
    "task-2": { id: "task-2", title: "Design columns", description: "Define TODO / IN PROGRESS / DONE" },
    "task-3": { id: "task-3", title: "Implement DnD", description: "Use @hello-pangea/dnd" },
  },
  columns: {
    todo: { id: "todo", title: "TODO", taskIds: ["task-1", "task-2"] },
    inprogress: { id: "inprogress", title: "IN PROGRESS", taskIds: ["task-3"] },
    done: { id: "done", title: "DONE", taskIds: [] },
  },
  columnOrder: ["todo", "inprogress", "done"],
}

function arrayMove<T>(arr: T[], from: number, to: number) {
  const copy = arr.slice()
  const [removed] = copy.splice(from, 1)
  copy.splice(to, 0, removed)
  return copy
}

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BoardState>(initialState)

  const addTask: KanbanContextValue["addTask"] = ({ title, description }) => {
    const id = `task-${Date.now()}`
    const newTask: Task = { id, title: title.trim(), description: description?.trim() || "" }
    setState((prev) => {
      const nextTasks = { ...prev.tasks, [id]: newTask }
      const todoCol = prev.columns["todo"]
      const nextTodo = { ...todoCol, taskIds: [id, ...todoCol.taskIds] }
      return {
        ...prev,
        tasks: nextTasks,
        columns: { ...prev.columns, [nextTodo.id]: nextTodo },
      }
    })
  }

  const updateTask: KanbanContextValue["updateTask"] = (id, { title, description }) => {
    setState((prev) => {
      if (!prev.tasks[id]) return prev
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [id]: { ...prev.tasks[id], title: title.trim(), description: description?.trim() || "" },
        },
      }
    })
  }

  const deleteTask: KanbanContextValue["deleteTask"] = (id) => {
    setState((prev) => {
      if (!prev.tasks[id]) return prev
      const nextTasks = { ...prev.tasks }
      delete nextTasks[id]
      const nextColumns = Object.fromEntries(
        Object.entries(prev.columns).map(([cid, col]) => {
          const filtered = col.taskIds.filter((tid) => tid !== id)
          return [cid, { ...col, taskIds: filtered }]
        }),
      )
      return { ...prev, tasks: nextTasks, columns: nextColumns }
    })
  }

  const reorderTaskWithinColumn: KanbanContextValue["reorderTaskWithinColumn"] = (columnId, startIndex, endIndex) => {
    setState((prev) => {
      const col = prev.columns[columnId]
      if (!col) return prev
      const nextIds = arrayMove(col.taskIds, startIndex, endIndex)
      return { ...prev, columns: { ...prev.columns, [columnId]: { ...col, taskIds: nextIds } } }
    })
  }

  const moveTaskAcrossColumns: KanbanContextValue["moveTaskAcrossColumns"] = (
    sourceColumnId,
    destColumnId,
    sourceIndex,
    destIndex,
    taskId,
  ) => {
    setState((prev) => {
      const source = prev.columns[sourceColumnId]
      const dest = prev.columns[destColumnId]
      if (!source || !dest) return prev

      const sourceIds = source.taskIds.slice()
      sourceIds.splice(sourceIndex, 1)

      const destIds = dest.taskIds.slice()
      destIds.splice(destIndex, 0, taskId)

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [sourceColumnId]: { ...source, taskIds: sourceIds },
          [destColumnId]: { ...dest, taskIds: destIds },
        },
      }
    })
  }

  const value = useMemo<KanbanContextValue>(
    () => ({
      state,
      addTask,
      updateTask,
      deleteTask,
      reorderTaskWithinColumn,
      moveTaskAcrossColumns,
    }),
    [state],
  )

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
}

export function useKanban() {
  const ctx = useContext(KanbanContext)
  if (!ctx) throw new Error("useKanban must be used within KanbanProvider")
  return ctx
}
