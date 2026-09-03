/**
 * Analytics Service
 *
 * Handles communication with the analytics backend
 * Privacy-conscious visitor tracking
 *
 * Key features:
 * - Generates anonymous session ID (not stored, used only for deduplication)
 * - Prevents duplicate visit counting (via sessionStorage)
 * - Fails gracefully if backend is unavailable
 * - Caches stats to reduce API calls
 */

/**
 * Generate a unique session identifier
 * This is used to identify unique sessions without storing personal data
 * It's NOT persisted - only used for deduplication during the current session
 */
function generateSessionId(): string {
  // Use a combination of timestamp and random value
  // This creates a unique identifier for this browser session
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${random}`;
}

/**
 * Get or create session ID
 * Stored in sessionStorage (cleared when browser tab closes)
 */
function getSessionId(): string {
  const key = "analytics_session_id";
  let sessionId = sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(key, sessionId);
  }

  return sessionId;
}

/**
 * Check if we've already recorded a visit in this session
 * Prevents double-counting from React Strict Mode or route changes
 */
function hasRecordedVisit(): boolean {
  return sessionStorage.getItem("analytics_visit_recorded") === "true";
}

/**
 * Mark that we've recorded a visit
 */
function markVisitRecorded(): void {
  sessionStorage.setItem("analytics_visit_recorded", "true");
}

/**
 * Get the referrer (document.referrer)
 * Only includes the domain, not the full URL, for privacy
 */
function getReferrer(): string | null {
  if (!document.referrer) {
    return null;
  }

  try {
    const url = new URL(document.referrer);
    // Return just the domain, not the full URL
    return url.hostname;
  } catch {
    return null;
  }
}

/**
 * Get current page path
 */
function getCurrentPage(): string {
  // Use location.pathname to get the current page
  // This is used for page view distribution
  return window.location.pathname || "/";
}

/**
 * Record a visit to the analytics backend
 * Called once per session when the app initializes
 */
export async function recordVisit(
  backendUrl: string = import.meta.env.VITE_ANALYTICS_URL || "/api"
): Promise<void> {
  // Don't record if we've already done it in this session
  if (hasRecordedVisit()) {
    return;
  }

  try {
    const sessionId = getSessionId();
    const page = getCurrentPage();
    const referrer = getReferrer();

    const response = await fetch(`${backendUrl}/visit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        page: page,
        referrer: referrer,
      }),
    });

    if (response.ok) {
      markVisitRecorded();
    }
  } catch (error) {
    // Silently fail - analytics should never break the site
    console.debug("Analytics visit recording failed (this is OK):", error);
  }
}

/**
 * Cached stats with TTL
 */
interface CachedStats {
  data: AnalyticsStats;
  timestamp: number;
}

interface AnalyticsStats {
  total_visits: number;
  unique_sessions: number;
  visits_today: number;
  visits_this_week: number;
  visits_this_month: number;
  page_views: { [key: string]: number };
  last_updated: string;
}

let cachedStats: CachedStats | null = null;
const STATS_CACHE_TTL = 60000; // 60 seconds

/**
 * Get analytics stats from backend
 * Includes caching to reduce API calls
 */
export async function getStats(
  backendUrl: string = import.meta.env.VITE_ANALYTICS_URL || "/api"
): Promise<AnalyticsStats | null> {
  try {
    // Return cached stats if still fresh
    if (
      cachedStats &&
      Date.now() - cachedStats.timestamp < STATS_CACHE_TTL
    ) {
      return cachedStats.data;
    }

    const response = await fetch(`${backendUrl}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data: AnalyticsStats = await response.json();
      cachedStats = {
        data,
        timestamp: Date.now(),
      };
      return data;
    }

    return null;
  } catch (error) {
    // Silently fail - analytics should never break the site
    console.debug("Analytics stats retrieval failed (this is OK):", error);
    return null;
  }
}

/**
 * Format visit count for display
 * e.g., 12481 -> "12,481"
 */
export function formatVisitCount(count: number): string {
  return count.toLocaleString("en-US");
}

/**
 * Get a human-readable description of visits this week
 * e.g., "+124 this week"
 */
export function getWeeklyChange(
  visitsThisWeek: number,
  visitsThisMonth: number
): string {
  const visitsLastThreeWeeks = visitsThisMonth - visitsThisWeek;
  const weeklyAverage =
    visitsLastThreeWeeks > 0 ? Math.round(visitsLastThreeWeeks / 3) : 0;

  if (visitsThisWeek >= weeklyAverage) {
    const change = visitsThisWeek - weeklyAverage;
    if (change > 0) {
      return `+${change} this week`;
    }
  }

  return `${visitsThisWeek} this week`;
}
