import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth/admin';

export default async function AdminIndexPage() {
  if (await isAdmin()) {
    redirect('/admin/orders');
  }
  redirect('/admin/login');
}
