// scripts/scrape-instagram.js
// Run locally via `npm run sync-reels` to bypass Instagram's cloud blocking.
// It scrapes your reels using your home internet and pushes them straight to MongoDB.

require('dotenv').config();
const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const INSTAGRAM_USERNAME = 'wheelo.fit';

function parseNode(node) {
  if (!node) return null;

  const isReel =
    node.__typename === 'GraphVideo' ||
    node.__typename === 'XDTGraphVideo' ||
    node.is_video === true ||
    node.media_type === 2 ||
    node.product_type === 'clips';

  if (!isReel) return null;

  const shortcode = node.shortcode || node.code || (node.pk ? String(node.pk) : null);
  if (!shortcode) return null;

  const image =
    node.thumbnail_src ||
    node.display_url ||
    node.cover_frame_url ||
    node.image_versions2?.candidates?.[0]?.url ||
    node.thumbnail_resources?.[node.thumbnail_resources?.length - 1]?.src ||
    '';

  if (!image) return null;

  const likes =
    node.edge_liked_by?.count ??
    node.edge_media_preview_like?.count ??
    node.like_count ??
    0;

  const comments =
    node.edge_media_to_comment?.count ??
    node.comments_count ??
    node.comment_count ??
    0;

  const caption =
    node.edge_media_to_caption?.edges?.[0]?.node?.text ||
    node.caption?.text ||
    '';

  const takenAt = node.taken_at_timestamp || node.taken_at;
  const timestamp = takenAt ? new Date(takenAt * 1000).toISOString() : '';

  return {
    id: shortcode,
    image,
    link: `https://www.instagram.com/reel/${shortcode}/`,
    likes,
    comments,
    caption,
    timestamp,
  };
}

async function scrape() {
  console.log(`[Scraper] Launching browser to scrape @${INSTAGRAM_USERNAME}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
  });

  const page = await context.newPage();
  const reels = [];

  page.on('response', async (response) => {
    const url = response.url();
    const ct = response.headers()['content-type'] || '';
    if (!url.includes('instagram.com') || !ct.includes('json') || url.includes('/static/')) return;

    try {
      const json = await response.json();

      const edges =
        json?.data?.user?.edge_owner_to_timeline_media?.edges ||
        json?.data?.xdt_api__v1__feed__user_timeline_graphql_connection?.edges ||
        json?.graphql?.user?.edge_owner_to_timeline_media?.edges ||
        [];

      const clipEdges =
        json?.data?.xdt_api__v1__clips__user__connection_v2?.edges ||
        json?.items?.map(i => ({ node: i?.media || i })) ||
        [];

      for (const edge of [...edges, ...clipEdges]) {
        const p = parseNode(edge?.node || edge?.media);
        if (p) reels.push(p);
      }
    } catch { /* ignore */ }
  });

  console.log(`[Scraper] Navigating to Instagram (using your trusted local connection)...`);
  await page.goto(`https://www.instagram.com/${INSTAGRAM_USERNAME}/reels/`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.waitForTimeout(5000);

  await page.goto(`https://www.instagram.com/${INSTAGRAM_USERNAME}/`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.waitForTimeout(5000);

  await browser.close();

  const seen = new Set();
  const unique = reels.filter(r => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });

  unique.sort((a, b) => (b.likes + 3 * b.comments) - (a.likes + 3 * a.comments));
  const top4 = unique.slice(0, 4);

  console.log(`[Scraper] Successfully found ${top4.length} top reels.`);

  if (top4.length === 0) {
    console.error('[Scraper] Failed to find reels. Make sure your internet is working.');
    process.exit(1);
  }

  console.log(`[Scraper] Pushing reels to live MongoDB database...`);
  
  try {
    const ops = top4.map((r) => {
      const { id, ...updateData } = r;
      return prisma.instagramReel.upsert({
        where: { id: r.id },
        create: r,
        update: updateData,
      });
    });

    await prisma.$transaction(ops);

    const incomingIds = top4.map((r) => r.id);
    await prisma.instagramReel.deleteMany({
      where: { id: { notIn: incomingIds } },
    });

    console.log(`[Scraper] ✅ Success! Your website is now updated with the latest reels.`);
  } catch (err) {
    console.error('[Scraper] Database error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

scrape().catch(err => {
  console.error('[Scraper] Fatal error:', err);
  process.exit(1);
});
