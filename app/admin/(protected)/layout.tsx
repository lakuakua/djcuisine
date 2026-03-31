import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '@/lib/auth/admin';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="border-b border-red-900/40 bg-black/40 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/admin/orders" className="font-bold text-gold-400">
            DJ Cuisine · Admin
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-stone-400 hover:text-gold-300">
              View store
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
