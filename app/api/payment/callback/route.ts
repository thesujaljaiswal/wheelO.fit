import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPhonePePayment } from '@/lib/phonepe';

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const { searchParams } = new URL(req.url);
    const merchantOrderId = searchParams.get('merchantOrderId');

    if (!merchantOrderId) {
      return NextResponse.redirect(`${baseUrl}/payment-failed?reason=missing_order_id`, 303);
    }

    // Server-side verification via PhonePe SDK
    const { success, state } = await verifyPhonePePayment(merchantOrderId);

    const isRental = merchantOrderId.startsWith('RTXN_');

    if (success) {
      if (isRental) {
        const rental = await prisma.rentalBooking.findFirst({
          where: { transactionId: merchantOrderId },
        });

        if (!rental) {
          return NextResponse.redirect(`${baseUrl}/payment-failed?reason=rental_not_found`, 303);
        }

        if (rental.paymentStatus !== 'SUCCESS') {
          await prisma.rentalBooking.update({
            where: { id: rental.id },
            data: { paymentStatus: 'SUCCESS', status: 'CONFIRMED' },
          });
        }

        return NextResponse.redirect(`${baseUrl}/rentals/success?txn=${merchantOrderId}`, 303);
      } else {
        const reg = await prisma.registration.findFirst({
          where: { transactionId: merchantOrderId },
        });

        if (!reg) {
          return NextResponse.redirect(`${baseUrl}/payment-failed?reason=registration_not_found`, 303);
        }

        if (reg.paymentStatus !== 'SUCCESS') {
          await prisma.registration.update({
            where: { id: reg.id },
            data: { paymentStatus: 'SUCCESS' },
          });
        }

        return NextResponse.redirect(`${baseUrl}/ticket/${reg.ticketCode}`, 303);
      }
    } else {
      console.error('PhonePe payment not successful. State:', state);
      // Delete the pending registration or rental so it doesn't stay in the DB
      if (isRental) {
        await prisma.rentalBooking.deleteMany({
          where: { transactionId: merchantOrderId },
        });
      } else {
        await prisma.registration.deleteMany({
          where: { transactionId: merchantOrderId },
        });
      }
      return NextResponse.redirect(`${baseUrl}/payment-failed?reason=${state}`, 303);
    }

  } catch (error: unknown) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(`${baseUrl}/payment-failed?reason=server_error`, 303);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    console.log('PhonePe S2S Webhook received:', JSON.stringify(body));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
