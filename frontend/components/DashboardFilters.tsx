'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DashboardFiltersProps {
  onFilter: (filters: FilterState) => void;
  isLoading?: boolean;
  eventNames?: string[];
}

export interface FilterState {
  startDate: string;
  endDate: string;
  eventName?: string;
  sentiment?: 'All' | 'Positive' | 'Neutral' | 'Negative';
}

export function DashboardFilters({
  onFilter,
  isLoading = false,
  eventNames = [],
}: DashboardFiltersProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [sentiment, setSentiment] = useState<'All' | 'Positive' | 'Neutral' | 'Negative'>('All');

  const handleApplyFilter = () => {
    onFilter({
      startDate,
      endDate,
      eventName: eventName || undefined,
      sentiment: sentiment !== 'All' ? sentiment : undefined,
    });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setEventName('');
    setSentiment('All');
    onFilter({
      startDate: '',
      endDate: '',
      eventName: undefined,
      sentiment: undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-black mb-4">Filters</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border-gray-300"
            disabled={isLoading}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border-gray-300"
            disabled={isLoading}
          />
        </div>

        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Event Name</label>
          <Select value={eventName} onValueChange={setEventName} disabled={isLoading}>
            <SelectTrigger className="rounded-lg border-gray-300">
              <SelectValue placeholder="All events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All events</SelectItem>
              {eventNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sentiment */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Sentiment</label>
          <Select
            value={sentiment}
            onValueChange={(value) =>
              setSentiment(value as 'All' | 'Positive' | 'Neutral' | 'Negative')
            }
            disabled={isLoading}
          >
            <SelectTrigger className="rounded-lg border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Positive">Positive</SelectItem>
              <SelectItem value="Neutral">Neutral</SelectItem>
              <SelectItem value="Negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <Button
            onClick={handleApplyFilter}
            disabled={isLoading}
            className="flex-1 bg-[#A6F4C5] hover:bg-[#88E5B5] text-black font-semibold rounded-lg"
          >
            Apply
          </Button>
          <Button
            onClick={handleReset}
            disabled={isLoading}
            variant="outline"
            className="flex-1 border-gray-300 rounded-lg"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
