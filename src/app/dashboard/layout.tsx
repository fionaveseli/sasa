import { AppSidebar } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppContextProvider } from "@/context/app-context";
import { Separator } from "@radix-ui/react-separator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppContextProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="w-full flex h-12 shrink-0 items-center justify-between px-4 bg-primary-foreground sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4" />
            </div>
          </header>
          <div className="w-full p-3 flex-1 bg-primary-foreground">
            <Card className="rounded-lg bg-white min-h-[90vh] w-full overflow-y-auto p-6">
              {children}
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AppContextProvider>
  );
}
