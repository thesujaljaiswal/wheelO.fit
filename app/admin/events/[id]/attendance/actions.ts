'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getEventAttendance(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      registrations: {
        orderBy: { name: 'asc' }
      }
    }
  });
  
  if (!event) throw new Error('Event not found');
  
  const presentCount = event.registrations.filter((r) => r.isPresent).length;
  
  return { event, presentCount, totalCount: event.registrations.length };
}

export async function markPresent(ticketCode: string, eventId: string) {
  // Find the registration by ticketCode
  const registration = await prisma.registration.findUnique({
    where: { ticketCode }
  });

  if (!registration) {
    return { success: false, message: 'Invalid ticket code. Not found.' };
  }

  if (registration.eventId !== eventId) {
    return { success: false, message: 'Ticket is valid, but NOT for this event!' };
  }

  if (registration.isPresent) {
    return { success: true, message: 'User is already marked present!', alreadyPresent: true, registration };
  }

  const updated = await prisma.registration.update({
    where: { id: registration.id },
    data: { isPresent: true }
  });

  revalidatePath(`/admin/events/${eventId}/attendance`);
  revalidatePath(`/admin/attendance`);
  return { success: true, message: `Successfully marked ${updated.name} as present!`, registration: updated };
}

export async function togglePresence(registrationId: string, eventId: string, currentStatus: boolean) {
  await prisma.registration.update({
    where: { id: registrationId },
    data: { isPresent: !currentStatus }
  });
  
  revalidatePath(`/admin/events/${eventId}/attendance`);
  revalidatePath(`/admin/attendance`);
}
