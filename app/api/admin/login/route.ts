import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createAdminSession } from '@/lib/auth/admin';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = body?.password as string | undefined;
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }
    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    await createAdminSession();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[Admin login]', e);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
