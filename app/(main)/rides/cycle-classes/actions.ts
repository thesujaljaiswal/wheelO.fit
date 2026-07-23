'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitCycleClassInquiry(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const experienceLevel = formData.get('experienceLevel') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !phone) {
    return { error: 'Name, email, and phone are required fields.' };
  }

  try {
    // We are casting it because prisma client might not have type definitions loaded immediately due to locked file during generate.
    await (prisma as any).cycleClassInquiry.create({
      data: {
        name,
        email,
        phone,
        experienceLevel,
        message,
      },
    });

    revalidatePath('/admin/cycle-classes');
    return { success: 'Your inquiry has been submitted! We will contact you soon.' };
  } catch (error) {
    console.error('Failed to submit inquiry:', error);
    return { error: 'Failed to submit your inquiry. Please try again later.' };
  }
}
