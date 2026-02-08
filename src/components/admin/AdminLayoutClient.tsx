'use client';

import { SidebarProvider } from '@/context/SidebarContext';

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {children}
      </div>
    </SidebarProvider>
  );
}
