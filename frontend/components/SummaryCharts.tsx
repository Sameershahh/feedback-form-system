'use client';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface ChartData {
  sentiment?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  ratings?: Array<{
    rating: number;
    count: number;
  }>;
  trend?: Array<{
    date: string;
    count: number;
  }>;
}

interface SummaryChartsProps {
  data: ChartData;
  isLoading?: boolean;
}

export function SummaryCharts({ data, isLoading = false }: SummaryChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg h-80 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const sentimentData = data.sentiment
    ? [
        { name: 'Positive', value: data.sentiment.positive },
        { name: 'Neutral', value: data.sentiment.neutral },
        { name: 'Negative', value: data.sentiment.negative },
      ]
    : [];

  const ratingsData = data.ratings || [];
  const trendData = data.trend || [];

  const COLORS = {
    positive: '#10B981',
    neutral: '#F59E0B',
    negative: '#EF4444',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sentiment Pie Chart */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Sentiment Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sentimentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              <Cell fill={COLORS.positive} />
              <Cell fill={COLORS.neutral} />
              <Cell fill={COLORS.negative} />
            </Pie>
            <Tooltip formatter={(value) => value.toString()} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Ratings Distribution Bar Chart */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Rating Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ratingsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="rating" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value) => value.toString()}
            />
            <Bar dataKey="count" fill="#A6F4C5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feedback Trend Line Chart */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Feedback Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value) => value.toString()}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#A6F4C5"
              strokeWidth={2}
              dot={{ fill: '#A6F4C5', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
