"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Users,
  Calendar,
  FileText,
  UserIcon,
  LogOutIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CreateWorkspaceModal } from "./modals/create-workspace-modal";
import { useWorkspaces } from "@/contexts/WorkspaceContext";
import { formatCurrency } from "@/lib/utils";
import Logo from "./Logo";
import LogoutAction from "@/app/(logout)/logoutAction";
import { toast } from "sonner";
 

// Adicione type para props
type SidebarProps = {
  user: any; // Idealmente, defina um tipo mais específico para o user
};

export function Sidebar({ user }: SidebarProps) {
  const { workspaces, refreshWorkspaces } = useWorkspaces();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState<"all" | "active" | "late">(
    "all"
  );

  // Fecha o menu quando a tela for redimensionada para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    refreshWorkspaces();
  }, [refreshWorkspaces]);

  const handleLogout = () => {
    toast.success("Logout realizado com sucesso");
    LogoutAction();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed left-0 top-[72px]",
          "md:hidden",
          "h-7 w-7",
          "bg-[#0F172A]",
          "border-t border-r border-b border-white/10",
          "flex items-center justify-center",
          "rounded-r-md",
          "z-50",
          isOpen && "left-[280px]"
        )}
      >
        <svg 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          className={cn(
            "text-gray-400 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        >
          <path 
            d="M9 5l7 7-7 7" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed md:sticky top-0 left-0",
          "w-[280px] h-screen",
          "z-40",
          "transition-transform duration-300 ease-in-out",
          !isOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        <aside
          className={cn(


            "h-full w-full",
            "bg-[#0F172A]",
            "flex flex-col",
            "overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/50",
            "border-r border-white/10"
            
          )}
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Logo variant="white" width={190} height={65} />
          </div>

          {/* Área de scroll */}
          <div className="flex-1 overflow-y-auto">
            {/* Profile Section */}
            <div className="p-3 m-3 mb-6 bg-slate-800/50 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 p-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-200">
                    {user?.name.split(" ")[0]}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-400">Online</span>
                    <span></span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <LogOutIcon className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="px-3 space-y-1">
              {[
                { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                { href: "/dashboard/equipes", icon: Users, label: "Equipes" },
                { href: "/dashboard/calendario", icon: Calendar, label: "Calendário" },
                { href: "/dashboard/relatorios", icon: FileText, label: "Relatórios" },
                {
                  href: "/dashboard/fornecedores",
                  icon: UserIcon,
                  label: "Fornecedores",
                },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium",
                    "transition-all duration-200 group relative",
                    pathname === href
                      ? "text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md shadow-blue-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      pathname === href
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    )}
                  />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Projects Section */}
            <div className="mt-8 px-3">
              <div className="flex items-center justify-between mb-4 px-2">
                <div>
                  <h2 className="text-sm font-medium text-slate-300">
                    Projetos
                  </h2>
                  <p className="text-xs text-slate-500">
                    {workspaces?.length || 0} total
                  </p>
                </div>
                <CreateWorkspaceModal
                  onWorkspaceCreated={refreshWorkspaces}
                  typeButton="icon"
                />
              </div>

              {/* Filters */}
              <div className="bg-slate-800/50 p-1 rounded-lg mb-3">
                {["Todos", "Ativos", "Atrasados"].map((filter) => (
                  <button
                    key={filter}
                    className={cn(
                      "flex-1 px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                      selectedView === filter.toLowerCase()
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    )}
                    onClick={() => setSelectedView(filter.toLowerCase() as any)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar projetos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800/50 rounded-lg text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Projects List */}
              <div className="space-y-1">
                {workspaces?.map((workspace) => (
                  <Link
                    key={workspace.id}
                    href={`/dashboard/workspace/${workspace.id}`}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg group",
                      "transition-all duration-200",
                      pathname === `/dashboard/workspace/${workspace.id}`
                        ? "bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-white"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        workspace.status === "CONCLUIDO"
                          ? "bg-emerald-400"
                          : workspace.status === "ATRASADO"
                          ? "bg-rose-400"
                          : "bg-amber-400"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {workspace.nome}
                      </p>
                      <p className="text-xs text-slate-500 group-hover:text-slate-400 truncate">
                        {formatCurrency(workspace.orcamento)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
