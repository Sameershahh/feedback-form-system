'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
}

function StatCard({ label, value, subtext, highlight = false }: StatCardProps) {
  return (
    <div
      className={`rounded-lg p-6 shadow-sm transition-all ${
        highlight
          ? 'bg-white border-2 border-[#A6F4C5]'
          : 'bg-white border border-gray-200'
      }`}
    >
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      <p className="text-3xl font-bold text-black">{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}

interface DashboardStatsProps {
  totalFeedback: number;
  averageRating: number;
  positiveFeedback: number;
  neutralFeedback: number;
  negativeFeedback: number;
  highUrgencyCount: number;
  isLoading?: boolean;
}

export function DashboardStats({
  totalFeedback,
  averageRating,
  positiveFeedback,
  neutralFeedback,
  negativeFeedback,
  highUrgencyCount,
  isLoading = false,
}: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg p-6 bg-gray-100 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Feedback" value={totalFeedback} highlight={true} />
      <StatCard label="Average Rating" value={averageRating.toFixed(1)} subtext="out of 5" />
      <StatCard
        label="Positive"
        value={positiveFeedback}
        subtext={`${((positiveFeedback / totalFeedback) * 100).toFixed(0)}%`}
      />
      <StatCard
        label="Neutral"
        value={neutralFeedback}
        subtext={`${((neutralFeedback / totalFeedback) * 100).toFixed(0)}%`}
      />
      <StatCard
        label="Negative"
        value={negativeFeedback}
        subtext={`${((negativeFeedback / totalFeedback) * 100).toFixed(0)}%`}
      />
      <StatCard label="High Urgency" value={highUrgencyCount} highlight={false} />
    </div>
  );
}
