import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'djc_admin_session';

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || '';
}

function getSessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN?.trim() || '';
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!expected) {
    console.error('[Admin] ADMIN_PASSWORD is not set');
    return false;
  }
  return password === expected;
}

export async function createAdminSession(): Promise<void> {
  const token = getSessionToken();
  if (!token) {
    throw new Error('ADMIN_SESSION_TOKEN is not set');
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  try {
    const token = getSessionToken();
    if (!token) return false;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    return sessionCookie?.value === token;
  } catch {
    return false;
  }
}
