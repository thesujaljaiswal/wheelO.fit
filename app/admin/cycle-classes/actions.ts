'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleContactedStatus(id: string, currentStatus: boolean) {
  try {
    await (prisma as any).cycleClassInquiry.update({
      where: { id },
      data: { contacted: !currentStatus }
    });
    revalidatePath('/admin/cycle-classes');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle status:', error);
    return { error: 'Failed to update status' };
  }
}
