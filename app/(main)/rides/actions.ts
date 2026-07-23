'use server';

import prisma from '@/lib/prisma';

export async function registerForEvent(formData: FormData) {
  const eventId = formData.get('eventId') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  if (!eventId || !name || !email || !phone) {
    return { error: 'All fields are required.' };
  }

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || !event.isActive) {
      return { error: 'Event is no longer available.' };
    }

    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const ticketCode = `TKT-${randomString}`;

    await prisma.registration.create({
      data: {
        eventId,
        name,
        email,
        phone,
        ticketCode
      }
    });

    return { success: 'Registration successful! We will see you there.', ticketCode };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to submit registration. Please try again.' };
  }
}
