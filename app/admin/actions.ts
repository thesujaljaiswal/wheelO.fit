'use server';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  const user = await prisma.adminUser.findUnique({
    where: { username }
  });

  if (!user) {
    return { error: 'Invalid credentials' };
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    return { error: 'Invalid credentials' };
  }

  // Create session
  const session = await encrypt({ id: user.id, username: user.username, role: user.role });
  
  (await cookies()).set('admin_session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  redirect('/admin');
}

export async function logout() {
  (await cookies()).delete('admin_session');
  redirect('/admin/login');
}
