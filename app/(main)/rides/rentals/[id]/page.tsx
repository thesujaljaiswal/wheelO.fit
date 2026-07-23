import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CycleDetailView from './CycleDetailView';

export default async function CycleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const cycle = await (prisma as any).rentalCycle.findUnique({
    where: { id },
  });

  if (!cycle) {
    notFound();
  }

  return (
    <div>
      <CycleDetailView cycle={cycle} />
    </div>
  );
}
