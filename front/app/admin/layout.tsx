import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Gate: Si no está habilitado, redirige a unlock
  if (typeof window !== 'undefined' && localStorage.getItem('admin_enabled') !== 'true') {
    redirect('/admin/unlock');
  }
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}
