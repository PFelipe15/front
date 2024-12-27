"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
 
  LayoutDashboard, 
  Settings, 
  
 
  Menu, 
  X, 
  Search,
  Users,
  Calendar,
  FileText
} from 'lucide-react'
 import { useEffect, useState } from "react"
 import { cn } from "@/lib/utils"
  
import { CreateWorkspaceModal } from "./modals/create-workspace-modal"
import { useWorkspaces } from '@/contexts/WorkspaceContext'
 
 import { formatCurrency } from "@/lib/utils"
import Logo from './Logo'
   
export function Sidebar() {
  const { workspaces, refreshWorkspaces } = useWorkspaces()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
   const [searchQuery, setSearchQuery] = useState("")
  const [selectedView, setSelectedView] = useState<'all' | 'active' | 'late'>('all')
 
  // Verifica se é mobile
  useEffect(() => {
    const checkIfMobile = () => {
       if (window.innerWidth < 768) {
        setIsOpen(false)
      }
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  useEffect(() => {
    refreshWorkspaces()
  }, [refreshWorkspaces])

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className={cn(
          "fixed top-4 left-4 z-50 rounded-full p-2",
          "bg-primary backdrop-blur-sm border border-white/20",
          "hover:bg-secondary transition-all",
          "md:hidden",
          isOpen && "left-[270px]"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-[280px] h-screen",
          "bg-[#1a2b42]",
          "transition-all duration-300 ease-in-out",
          !isOpen && "-translate-x-full",
          "md:sticky md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-center border-b border-white/10">
          <Logo variant="white" width={190} height={65} />
        </div>

        {/* Navigation */}
        <div className="p-6 space-y-8">
          <nav className="space-y-2">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                "transition-colors duration-200",
                pathname === "/" 
                  ? "bg-blue-500/10 text-blue-400" 
                  : "text-gray-300 hover:bg-blue-500/10 hover:text-blue-400"
              )}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>

            <Link
              href="/equipes"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                "transition-colors duration-200",
                pathname === "/equipes" 
                  ? "bg-blue-500/10 text-blue-400" 
                  : "text-gray-300 hover:bg-blue-500/10 hover:text-blue-400"
              )}
            >
              <Users className="h-5 w-5" />
              Equipes
            </Link>

            <Link
              href="/calendario"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                "transition-colors duration-200",
                pathname === "/calendario" 
                  ? "bg-blue-500/10 text-blue-400" 
                  : "text-gray-300 hover:bg-blue-500/10 hover:text-blue-400"
              )}
            >
              <Calendar className="h-5 w-5" />
              Calendário
            </Link>

            <Link
              href="/relatorios"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                "transition-colors duration-200",
                pathname === "/relatorios" 
                  ? "bg-blue-500/10 text-blue-400" 
                  : "text-gray-300 hover:bg-blue-500/10 hover:text-blue-400"
              )}
            >
              <FileText className="h-5 w-5" />
              Relatórios
            </Link>
          </nav>

          {/* Projetos Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-300">Projetos</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {workspaces?.length || 0} total
                </p>
              </div>
              <CreateWorkspaceModal onWorkspaceCreated={refreshWorkspaces} typeButton="icon"/>
            </div>

            {/* Filtros */}
            <div className="p-1  bg-white/5 rounded-lg">
              <div className="grid grid-cols-3 gap-1">
                {['all', 'active', 'late'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setSelectedView(view as any)}
                    className={cn(
                      "px-3 py-2 text-xs font-medium rounded-md transition-colors",
                      selectedView === view 
                        ? "bg-blue-500 text-white" 
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    {view === 'all' && 'Todos'}
                    {view === 'active' && 'Ativos'}
                    {view === 'late' && 'Atrasados'}
                  </button>
                ))}
              </div>
            </div>

            {/* Busca */}
            <div className="px-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar projetos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full pl-9 pr-4 py-2 text-sm",
                    "bg-white/5 rounded-lg border border-white/10",
                    "text-gray-300 placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  )}
                />
              </div>
            </div>

            {/* Lista de Projetos */}
            <div className="space-y-1 px-4 mt-4">
              {workspaces?.map((workspace) => (
                <Link
                  key={workspace.id}
                  href={`/workspace/${workspace.id}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg",
                    "transition-colors duration-200",
                    pathname === `/workspace/${workspace.id}`
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-gray-300 hover:bg-blue-500/10 hover:text-blue-400"
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full ring-2 ring-offset-2 ring-offset-[#1a2b42]",
                    workspace.status === 'CONCLUIDO'
                      ? "bg-green-500 ring-green-500/20"
                      : workspace.status === 'ATRASADO'
                        ? "bg-red-500 ring-red-500/20"
                        : "bg-yellow-500 ring-yellow-500/20"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {workspace.nome}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {formatCurrency(workspace.orcamento)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

