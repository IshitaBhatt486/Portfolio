/**
 * Portfolio Analytics Worker
 *
 * Privacy-conscious visitor tracking using Cloudflare Workers + D1
 * Free tier: Unlimited requests, perfect for personal portfolios
 */

type Env = {
  ANALYTICS_DB: D1Database;
};

/**
 * Initialize database schema on first request
 */
async function initDatabase(db: D1Database): Promise<void> {
  try {
    await db.prepare(
      `CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        page TEXT NOT NULL,
        referrer TEXT,
        timestamp INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    ).run();

    // Create indexes for performance
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_session_id ON visits(session_id)`).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_timestamp ON visits(timestamp)`).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_page ON visits(page)`).run();
  } catch (error) {
    // Table likely exists - silently continue
  }
}

/**
 * Check rate limit to prevent abuse
 */
async function checkRateLimit(
  db: D1Database,
  sessionId: string
): Promise<boolean> {
  const oneMinuteAgo = Math.floor(Date.now() / 1000) - 60;
  const result = await db
    .prepare(`SELECT COUNT(*) as count FROM visits WHERE session_id = ? AND timestamp > ?`)
    .bind(sessionId, oneMinuteAgo)
    .first<{ count: number }>();
  return (result?.count ?? 0) < 100;
}

/**
 * Record a visit to the database
 */
async function recordVisit(
  db: D1Database,
  sessionId: string,
  page: string,
  referrer: string | null
): Promise<{ success: boolean; message: string }> {
  try {
    // Validate
    if (!sessionId || sessionId.length > 50) {
      return { success: false, message: "Invalid session ID" };
    }
    if (!page || page.length > 255) {
      return { success: false, message: "Invalid page" };
    }
    if (referrer && referrer.length > 2048) {
      return { success: false, message: "Invalid referrer" };
    }

    // Rate limit check
    if (!(await checkRateLimit(db, sessionId))) {
      return { success: false, message: "Rate limit exceeded" };
    }

    // Insert
    const timestamp = Math.floor(Date.now() / 1000);
    await db
      .prepare(`INSERT INTO visits (session_id, page, referrer, timestamp) VALUES (?, ?, ?, ?)`)
      .bind(sessionId, page, referrer || null, timestamp)
      .run();

    return { success: true, message: "Visit recorded" };
  } catch (error) {
    console.error("Visit error:", error);
    return { success: false, message: "Database error" };
  }
}

/**
 * Get public statistics
 */
async function getStats(db: D1Database): Promise<Record<string, any>> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - 86400;
    const sevenDaysAgo = now - 604800;
    const thirtyDaysAgo = now - 2592000;

    const total = await db
      .prepare(`SELECT COUNT(*) as count FROM visits`)
      .first<{ count: number }>();

    const unique = await db
      .prepare(`SELECT COUNT(DISTINCT session_id) as count FROM visits`)
      .first<{ count: number }>();

    const today = await db
      .prepare(`SELECT COUNT(*) as count FROM visits WHERE timestamp > ?`)
      .bind(oneDayAgo)
      .first<{ count: number }>();

    const week = await db
      .prepare(`SELECT COUNT(*) as count FROM visits WHERE timestamp > ?`)
      .bind(sevenDaysAgo)
      .first<{ count: number }>();

    const month = await db
      .prepare(`SELECT COUNT(*) as count FROM visits WHERE timestamp > ?`)
      .bind(thirtyDaysAgo)
      .first<{ count: number }>();

    const pages = await db
      .prepare(`SELECT page, COUNT(*) as count FROM visits GROUP BY page ORDER BY count DESC LIMIT 10`)
      .all<{ page: string; count: number }>();

    const pageViews: Record<string, number> = {};
    if (pages?.results) {
      for (const row of pages.results) {
        pageViews[row.page] = row.count;
      }
    }

    return {
      total_visits: total?.count ?? 0,
      unique_sessions: unique?.count ?? 0,
      visits_today: today?.count ?? 0,
      visits_this_week: week?.count ?? 0,
      visits_this_month: month?.count ?? 0,
      page_views: pageViews,
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Stats error:", error);
    return {
      total_visits: 0,
      unique_sessions: 0,
      visits_today: 0,
      visits_this_week: 0,
      visits_this_month: 0,
      page_views: {},
      last_updated: new Date().toISOString(),
    };
  }
}

/**
 * CORS headers
 */
function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

/**
 * Main handler
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Initialize DB
    try {
      await initDatabase(env.ANALYTICS_DB);
    } catch (e) {
      // Continue
    }

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    // GET /api/stats - Public stats
    if (path === "/api/stats" && request.method === "GET") {
      const stats = await getStats(env.ANALYTICS_DB);
      return new Response(JSON.stringify(stats), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
          ...corsHeaders(),
        },
      });
    }

    // POST /api/visit - Record visit
    if (path === "/api/visit" && request.method === "POST") {
      try {
        const body = (await request.json()) as Record<string, unknown>;
        const sessionId = body.session_id as string;
        const page = body.page as string;
        const referrer = (body.referrer as string) || null;

        if (!sessionId || !page) {
          return new Response(
            JSON.stringify({ success: false, message: "Missing fields" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
          );
        }

        const result = await recordVisit(env.ANALYTICS_DB, sessionId, page, referrer);
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { "Content-Type": "application/json", ...corsHeaders() },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid request" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
        );
      }
    }

    // 404
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  },
};
