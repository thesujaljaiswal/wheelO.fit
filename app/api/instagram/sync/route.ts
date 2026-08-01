import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// This endpoint is called by the GitHub Actions cron job.
// It accepts an array of reel objects and upserts them into MongoDB.
// Protected by a shared secret (INSTAGRAM_SYNC_SECRET env var).

interface ReelPayload {
  id: string;       // shortcode
  image: string;    // thumbnail CDN URL
  link: string;     // https://www.instagram.com/reel/{shortcode}/
  likes: number;
  comments: number;
  caption: string;
  timestamp: string; // ISO string
}

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = process.env.INSTAGRAM_SYNC_SECRET;
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let reels: ReelPayload[];
  try {
    const body = await req.json();
    reels = body?.reels;
    if (!Array.isArray(reels) || reels.length === 0) {
      return NextResponse.json({ error: 'reels array required' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ── Upsert each reel ──────────────────────────────────────────────────────
  try {
    const ops = reels.map((r) =>
      prisma.instagramReel.upsert({
        where: { id: r.id },
        create: {
          id: r.id,
          image: r.image,
          link: r.link,
          likes: r.likes,
          comments: r.comments,
          caption: r.caption,
          timestamp: r.timestamp,
        },
        update: {
          image: r.image,
          link: r.link,
          likes: r.likes,
          comments: r.comments,
          caption: r.caption,
          timestamp: r.timestamp,
        },
      })
    );

    await prisma.$transaction(ops);

    // Remove any reels that were NOT in this batch (keeps DB in sync)
    const incomingIds = reels.map((r) => r.id);
    await prisma.instagramReel.deleteMany({
      where: { id: { notIn: incomingIds } },
    });

    console.log(`[Instagram Sync] Upserted ${reels.length} reels`);
    return NextResponse.json({ ok: true, count: reels.length });
  } catch (err) {
    console.error('[Instagram Sync] DB error:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
