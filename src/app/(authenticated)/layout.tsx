import { Sidebar } from "@/components/sidebar"
import { WorkspaceProvider } from "@/contexts/WorkspaceContext"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex ">
      <WorkspaceProvider>

<div className="flex-1 max-w-[250px] ">
      <Sidebar />
</div>
      <div className="flex-1">
        <main className="p-8 px-10">
          {children}
        </main>
      </div>
      </WorkspaceProvider>
    </div>
  )
} 