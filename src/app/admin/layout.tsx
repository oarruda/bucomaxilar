'use client';

import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import { LayoutDashboard, Settings, LogOut, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="bg-sidebar">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/admin/leads"
                  isActive={pathname.startsWith('/admin/leads')}
                  tooltip="Leads"
                >
                  <Users />
                  <span>Leads</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/admin/settings"
                  isActive={pathname.startsWith('/admin/settings')}
                  tooltip="Configurações"
                >
                  <Settings />
                  <span>Configurações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start gap-2 px-2" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              <span className="group-data-[collapsible=icon]:hidden">Sair</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 bg-background">{children}</main>
      </div>
    </SidebarProvider>
  );
}
