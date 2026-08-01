// scripts/scrape-instagram.js
// Runs in GitHub Actions.
// Uses Apify to bypass Instagram IP blocks.
// Outputs top-4 reels as JSON to OUTPUT_FILE env var path.

const fs = require('fs');
const path = require('path');

const INSTAGRAM_USERNAME = process.env.INSTAGRAM_USERNAME || 'wheelo.fit';
const OUTPUT_FILE = process.env.OUTPUT_FILE || path.join(__dirname, '../tmp/reels.json');
const APIFY_TOKEN = process.env.APIFY_TOKEN;

async function scrape() {
  if (!APIFY_TOKEN) {
    console.error('[Scraper] Fatal: APIFY_TOKEN is missing! Set it in GitHub Secrets.');
    process.exit(1);
  }

  console.log(`[Scraper] Starting Apify Instagram Scraper for @${INSTAGRAM_USERNAME}`);

  // We use the popular "apify/instagram-post-scraper" actor.
  // The run-sync-get-dataset-items endpoint blocks until the run finishes and returns the items directly.
  const url = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

  // Configure the actor input
  const input = {
    addParentData: false,
    directUrls: [`https://www.instagram.com/${INSTAGRAM_USERNAME}/reels/`],
    enhanceUserSearchWithFacebookPage: false,
    isUserReelFeedURL: false,
    isUserTaggedFeedURL: false,
    resultsLimit: 15,
    resultsType: 'posts',
    searchLimit: 1,
    searchType: 'hashtag'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[Scraper] Apify API error: ${response.status} - ${text}`);
      process.exit(1);
    }

    const items = await response.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('[Scraper] No items returned from Apify.');
      process.exit(1);
    }

    // Process and normalize the data
    const reels = [];
    for (const item of items) {
      // Instagram reels typically have isVideo = true or type = 'Video'
      if (!item.isVideo) continue;
      
      const shortcode = item.shortCode;
      if (!shortcode) continue;

      reels.push({
        id: shortcode,
        image: item.displayUrl || item.thumbnailUrl || '',
        link: `https://www.instagram.com/reel/${shortcode}/`,
        likes: item.likesCount || 0,
        comments: item.commentsCount || 0,
        caption: item.caption || '',
        timestamp: item.timestamp || new Date().toISOString(),
      });
    }

    // Deduplicate
    const seen = new Set();
    const unique = reels.filter(r => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });

    // Sort by engagement and take top 4
    unique.sort((a, b) => (b.likes + 3 * b.comments) - (a.likes + 3 * a.comments));
    const top4 = unique.slice(0, 4);

    console.log(`[Scraper] Found ${unique.length} reels, keeping top ${top4.length}`);

    if (top4.length === 0) {
      console.error('[Scraper] No reels found in the output data.');
      process.exit(1);
    }

    // Write JSON output
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(top4, null, 2));
    console.log(`[Scraper] Written ${top4.length} reels to ${OUTPUT_FILE}`);

  } catch (err) {
    console.error('[Scraper] Fatal fetch error:', err);
    process.exit(1);
  }
}

scrape();
