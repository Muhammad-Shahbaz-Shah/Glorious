import { AppSidebar } from "@/components/subComponents/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-muted-foreground text-sm">Overview of your store</p>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 mt-3 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
