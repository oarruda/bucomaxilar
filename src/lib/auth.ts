"use server";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE_NAME = 'consulta_facil_session';
// In a real app, use a secure, randomly generated secret from environment variables
// For this demo, we'll use a hardcoded password.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_VALUE = 'user_is_authenticated';

export async function signIn(password: string) {
  if (password === ADMIN_PASSWORD) {
    cookies().set(SESSION_COOKIE_NAME, SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  }
  return { success: false, error: 'Senha inválida' };
}

export async function signOut() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/admin/login');
}

export async function isAuthenticated() {
  const session = cookies().get(SESSION_COOKIE_NAME);
  return session?.value === SESSION_VALUE;
}
