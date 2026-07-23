'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

import cloudinary from '@/lib/cloudinary';

async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'wheelo-rentals' },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
}

export async function createRentalCycle(formData: FormData) {
  const type = formData.get('type') as string;
  const quantity = parseInt(formData.get('quantity') as string, 10);
  const image = formData.get('image') as File;
  
  const category = formData.get('category') as string;
  const tyreSize = formData.get('tyreSize') as string;
  const speed = formData.get('speed') as string;
  const bikeType = formData.get('bikeType') as string;
  const brakes = formData.get('brakes') as string;
  
  if (!type || isNaN(quantity)) {
    return { error: 'Invalid cycle data.' };
  }

  let imageUrl = null;
  if (image && image.size > 0) {
    try {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageUrl = await uploadToCloudinary(buffer);
    } catch (e) {
      console.error('Image upload failed', e);
    }
  }

  // Parse dynamic pricing options
  const pricingOptions = [];
  const entries = Array.from(formData.entries());
  
  const count = entries.filter(([key]) => key.startsWith('pricingLabel_')).length;
  
  for (let i = 0; i < count; i++) {
    const label = formData.get(`pricingLabel_${i}`) as string;
    const value = parseInt(formData.get(`pricingValue_${i}`) as string, 10);
    const unit = formData.get(`pricingUnit_${i}`) as string || 'DAYS';
    const price = parseInt(formData.get(`pricingPrice_${i}`) as string, 10);
    
    if (label && !isNaN(value) && !isNaN(price)) {
      pricingOptions.push({ durationLabel: label, durationValue: value, durationUnit: unit, price });
    }
  }

  try {
    await (prisma as any).rentalCycle.create({
      data: {
        type,
        quantity,
        imageUrl,
        category,
        tyreSize,
        speed,
        bikeType,
        brakes,
        pricing: pricingOptions
      }
    });
    
    revalidatePath('/admin/rentals');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to create rental cycle.' };
  }
}

export async function toggleCycleActive(id: string, currentStatus: boolean) {
  try {
    await (prisma as any).rentalCycle.update({
      where: { id },
      data: { isActive: !currentStatus }
    });
    revalidatePath('/admin/rentals');
  } catch (error) {
    console.error(error);
  }
}

export async function deleteCycle(id: string) {
  try {
    await (prisma as any).rentalCycle.delete({ where: { id } });
    revalidatePath('/admin/rentals');
  } catch (error) {
    console.error(error);
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    await (prisma as any).rentalBooking.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/admin/rentals/bookings');
  } catch (error) {
    console.error(error);
  }
}

export async function updateRentalCycle(id: string, formData: FormData) {
  const type = formData.get('type') as string;
  const quantity = parseInt(formData.get('quantity') as string, 10);
  const image = formData.get('image') as File;
  
  const category = formData.get('category') as string;
  const tyreSize = formData.get('tyreSize') as string;
  const speed = formData.get('speed') as string;
  const bikeType = formData.get('bikeType') as string;
  const brakes = formData.get('brakes') as string;
  
  if (!type || isNaN(quantity)) {
    return { error: 'Invalid cycle data.' };
  }

  let imageUrl = undefined;
  if (image && image.size > 0) {
    try {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageUrl = await uploadToCloudinary(buffer);
    } catch (e) {
      console.error('Image upload failed', e);
    }
  }

  // Parse dynamic pricing options
  const pricingOptions = [];
  const entries = Array.from(formData.entries());
  
  const count = entries.filter(([key]) => key.startsWith('pricingLabel_')).length;
  
  for (let i = 0; i < count; i++) {
    const label = formData.get(`pricingLabel_${i}`) as string;
    const value = parseInt(formData.get(`pricingValue_${i}`) as string, 10);
    const unit = formData.get(`pricingUnit_${i}`) as string || 'DAYS';
    const price = parseInt(formData.get(`pricingPrice_${i}`) as string, 10);
    
    if (label && !isNaN(value) && !isNaN(price)) {
      pricingOptions.push({ durationLabel: label, durationValue: value, durationUnit: unit, price });
    }
  }

  const dataToUpdate: any = {
    type,
    quantity,
    category,
    tyreSize,
    speed,
    bikeType,
    brakes,
    pricing: pricingOptions
  };
  
  if (imageUrl) {
    dataToUpdate.imageUrl = imageUrl;
  }

  try {
    await (prisma as any).rentalCycle.update({
      where: { id },
      data: dataToUpdate
    });
    
    revalidatePath('/admin/rentals');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update rental cycle.' };
  }
}
