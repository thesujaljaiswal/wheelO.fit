'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getFAQs() {
  try {
    return await (prisma as any).fAQ.findMany({
      orderBy: { order: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export async function createFAQ(formData: FormData) {
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;
  const order = parseInt(formData.get('order') as string, 10) || 0;

  if (!question || !answer) return { error: 'Question and answer are required' };

  try {
    await (prisma as any).fAQ.create({
      data: {
        question,
        answer,
        order,
        isActive: true
      }
    });
    revalidatePath('/admin/faqs');
    revalidatePath('/');
    return { success: 'FAQ created successfully' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to create FAQ' };
  }
}

export async function updateFAQ(id: string, formData: FormData) {
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;
  const isActive = formData.get('isActive') === 'on' || formData.get('isActive') === 'true';

  try {
    await (prisma as any).fAQ.update({
      where: { id },
      data: {
        question,
        answer,
        isActive
      }
    });
    revalidatePath('/admin/faqs');
    revalidatePath('/');
    return { success: 'FAQ updated successfully' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update FAQ' };
  }
}

export async function deleteFAQ(id: string) {
  try {
    await (prisma as any).fAQ.delete({
      where: { id }
    });
    revalidatePath('/admin/faqs');
    revalidatePath('/');
    return { success: 'FAQ deleted successfully' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to delete FAQ' };
  }
}

export async function updateFAQOrder(orderedIds: string[]) {
  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await (prisma as any).fAQ.update({
        where: { id: orderedIds[i] },
        data: { order: i }
      });
    }
    revalidatePath('/admin/faqs');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update order' };
  }
}

