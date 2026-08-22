'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPaymentLink(formData: FormData) {
  try {
    const amountStr = formData.get('amount') as string;
    const purpose = formData.get('purpose') as string;
    const durationHoursStr = formData.get('durationHours') as string;

    const amount = parseInt(amountStr, 10);
    const durationHours = parseInt(durationHoursStr, 10);

    if (isNaN(amount) || amount <= 0) {
      return { error: 'Invalid amount' };
    }
    if (isNaN(durationHours) || durationHours <= 0) {
      return { error: 'Invalid duration' };
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + durationHours);

    const link = await prisma.paymentLink.create({
      data: {
        amount,
        purpose: purpose || null,
        expiresAt,
        paymentStatus: 'PENDING',
      },
    });

    revalidatePath('/admin/payment-links');
    return { success: true, link };
  } catch (error: unknown) {
    console.error('Error creating payment link:', error);
    return { error: 'Failed to create payment link' };
  }
}

export async function deletePaymentLink(id: string) {
  try {
    await prisma.paymentLink.delete({
      where: { id },
    });
    revalidatePath('/admin/payment-links');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting payment link:', error);
    return { error: 'Failed to delete payment link' };
  }
}
