"use client"

import { createContext, useContext, useState, useCallback } from 'react'
import { Workspace } from '@/types'
 interface WorkspaceContextType {
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  refreshWorkspaces: () => Promise<void>
  refreshCurrentWorkspace: (id: number) => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaces: [],
  currentWorkspace: null,
  refreshWorkspaces: async () => {},
  refreshCurrentWorkspace: async () => {},
})

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)

  const refreshWorkspaces = useCallback(async () => {
    try {
      const response = await fetch('/api/workspaces')
       const data = await response.json()
      setWorkspaces(data)
    } catch (error) {
      console.error('Erro ao buscar workspaces:', error)
    }
  }, [])

  const refreshCurrentWorkspace = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/workspaces/${id}`)
      const data = await response.json()
      setCurrentWorkspace(data)
    } catch (error) {
      console.error('Erro ao buscar workspace:', error)
    }
  }, [])

   return (
    <WorkspaceContext.Provider value={{ workspaces, refreshWorkspaces, refreshCurrentWorkspace, currentWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspaces = () => useContext(WorkspaceContext) 