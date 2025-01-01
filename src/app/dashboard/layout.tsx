import { Sidebar } from "@/components/sidebar";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth()
 
  if(!session) {
    return redirect('/login')
  }
 
  return (
    <div className="flex min-h-screen">
      <SessionProvider>
      <WorkspaceProvider> 
        <Toaster richColors closeButton position="top-right" />
        <div className="w-[280px] fixed md:relative top-0 left-0 h-screen z-40">
          <Sidebar user={session?.user} />
        </div>
        <div className="flex-1">
          <main className="p-8 px-10">{children}</main>

        </div>

      </WorkspaceProvider>
      </SessionProvider>
    </div>
  );
}
