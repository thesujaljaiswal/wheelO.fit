import { NextResponse } from 'next/server';
import { chromium, Browser } from 'playwright';

const INSTAGRAM_USERNAME = 'wheelo.fit';

export interface Post {
  id: string;
  type: 'reel';
  image: string;
  link: string;
  likes: number;
  comments: number;
  caption: string;
  timestamp: string;
}

async function scrapeInstagramReels(): Promise<Post[]> {
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      locale: 'en-US',
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const page = await context.newPage();

    // Hide webdriver fingerprint
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    const posts: Post[] = [];

    // Intercept Instagram's GraphQL responses — this is where the real post data lives
    page.on('response', async (response) => {
      const url = response.url();
      const ct = response.headers()['content-type'] || '';

      if (
        url.includes('instagram.com') &&
        ct.includes('json') &&
        !url.includes('/static/')
      ) {
        try {
          const json = await response.json();

          // Primary: GraphQL timeline response (edge_owner_to_timeline_media)
          const edges =
            json?.data?.user?.edge_owner_to_timeline_media?.edges ||
            json?.data?.xdt_api__v1__feed__user_timeline_graphql_connection?.edges ||
            [];

          for (const edge of edges) {
            const node = edge?.node;
            if (!node) continue;

            const shortcode = node.shortcode || node.code;
            const isVideo =
              node.__typename === 'GraphVideo' ||
              node.__typename === 'XDTGraphVideo' ||
              node.is_video === true;

            // Only fetch reels
            if (!isVideo) continue;

            // Try multiple image URL sources in order of preference
            const image =
              node.thumbnail_src ||
              node.display_url ||
              node.thumbnail_resources?.[node.thumbnail_resources.length - 1]?.src ||
              node.image_versions2?.candidates?.[0]?.url ||
              '';

            const likes =
              node.edge_liked_by?.count ??
              node.edge_media_preview_like?.count ??
              node.like_count ??
              0;

            const comments =
              node.edge_media_to_comment?.count ??
              node.comments_count ??
              0;

            const caption =
              node.edge_media_to_caption?.edges?.[0]?.node?.text ||
              node.caption?.text ||
              '';

            const takenAt = node.taken_at_timestamp || node.taken_at;
            const timestamp = takenAt
              ? new Date(takenAt * 1000).toISOString()
              : '';

            if (shortcode && image) {
              posts.push({
                id: shortcode,
                type: 'reel',
                image,
                link: `https://www.instagram.com/reel/${shortcode}/`,
                likes,
                comments,
                caption,
                timestamp,
              });
            }
          }
        } catch {
          // Not all responses are JSON — ignore
        }
      }
    });

    await page.goto(`https://www.instagram.com/${INSTAGRAM_USERNAME}/`, {
      waitUntil: 'domcontentloaded',
      timeout: 25000,
    });

    // Wait for network requests to resolve
    await page.waitForTimeout(6000);

    await browser.close();
    browser = null;

    // Deduplicate by shortcode
    const seen = new Set<string>();
    const unique = posts.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    // Sort by popularity: likes + 3 × comments (descending)
    unique.sort((a, b) => (b.likes + 3 * b.comments) - (a.likes + 3 * a.comments));

    return unique.slice(0, 4);
  } catch (err) {
    console.error('[Instagram Scraper] Error:', err);
    if (browser) await browser.close();
    return [];
  }
}

export async function GET() {
  try {
    const posts = await scrapeInstagramReels();

    if (posts.length > 0) {
      return NextResponse.json({ posts, source: 'live' });
    }

    return NextResponse.json(
      { error: 'Could not fetch Instagram reels' },
      { status: 502 }
    );
  } catch (err) {
    console.error('[Instagram API] Unhandled error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
