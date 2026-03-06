'use client';

import { Star, FileText } from 'lucide-react';

interface FeedbackItem {
  submissionId: string;
  eventName: string;
  rating: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  summary: string;
  pdfUrl?: string;
  timestamp: string;
}

interface FeedbackTableProps {
  items: FeedbackItem[];
  isLoading?: boolean;
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-700';

  if (sentiment === 'Positive') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-700';
  } else if (sentiment === 'Neutral') {
    bgColor = 'bg-orange-100';
    textColor = 'text-orange-700';
  } else if (sentiment === 'Negative') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-700';
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      {sentiment}
    </span>
  );
}

function RatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < rating ? 'fill-[#A6F4C5] text-[#A6F4C5]' : 'text-gray-300'
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-2">{rating}/5</span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-200">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
    </tr>
  );
}

export function FeedbackTable({ items, isLoading = false }: FeedbackTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-black text-sm">Event Name</th>
              <th className="text-left px-6 py-4 font-semibold text-black text-sm">Rating</th>
              <th className="text-left px-6 py-4 font-semibold text-black text-sm">Sentiment</th>
              <th className="text-left px-6 py-4 font-semibold text-black text-sm">Summary</th>
              <th className="text-left px-6 py-4 font-semibold text-black text-sm">Report</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
        <p className="text-gray-500">No feedback found for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-black text-sm">Event Name</th>
              <th className="text-left px-6 py-4 font-semibold text-black text-sm">Rating</th>
              <th className="text-left px-6 py-4 font-semibold text-black text-sm">Sentiment</th>
              <th className="text-left px-6 py-4 font-semibold text-black text-sm">Summary</th>
              <th className="text-left px-6 py-4 font-semibold text-black text-sm">Report</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.submissionId} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-black font-medium">{item.eventName}</td>
                <td className="px-6 py-4">
                  <RatingDisplay rating={item.rating} />
                </td>
                <td className="px-6 py-4">
                  <SentimentBadge sentiment={item.sentiment} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="line-clamp-2">{item.summary}</span>
                </td>
                <td className="px-6 py-4">
                  {item.pdfUrl ? (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#A6F4C5] hover:text-[#88E5B5] font-medium transition-colors"
                    >
                      <FileText size={16} />
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
