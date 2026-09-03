import React, { useEffect, useState } from "react";
import { getStats, formatVisitCount, getWeeklyChange } from "../lib/analytics";

/**
 * VisitorStats Component
 *
 * Displays public visitor metrics in a clean, minimal format
 * Falls back gracefully if analytics backend is unavailable
 */
interface VisitorStatsProps {
  backendUrl?: string;
}

interface StatsData {
  total_visits: number;
  visits_this_week: number;
  visits_this_month: number;
}

export const VisitorStats: React.FC<VisitorStatsProps> = ({
  backendUrl = import.meta.env.VITE_ANALYTICS_URL || "/api",
}) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch stats on component mount
    const fetchStats = async () => {
      try {
        const data = await getStats(backendUrl);
        if (data) {
          setStats({
            total_visits: data.total_visits,
            visits_this_week: data.visits_this_week,
            visits_this_month: data.visits_this_month,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="visitor-stats-skeleton">
        <div className="stat-label skeleton-text" />
        <div className="stat-number skeleton-text" />
        <div className="stat-subtitle skeleton-text" />
      </div>
    );
  }

  // Show nothing if stats unavailable (graceful degradation)
  if (!stats) {
    return null;
  }

  const formattedCount = formatVisitCount(stats.total_visits);
  const weeklyInfo = getWeeklyChange(
    stats.visits_this_week,
    stats.visits_this_month
  );

  return (
    <div className="visitor-stats">
      <div className="stat-label">VISITORS</div>
      <div className="stat-number">{formattedCount}</div>
      <div className="stat-subtitle">{weeklyInfo}</div>
    </div>
  );
};

export default VisitorStats;
