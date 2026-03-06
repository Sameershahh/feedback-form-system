'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { DashboardFilters, FilterState } from '@/components/DashboardFilters';
import { DashboardStats } from '@/components/DashboardStats';
import { FeedbackTable } from '@/components/FeedbackTable';
import { SummaryCharts } from '@/components/SummaryCharts';
import { Logo } from '@/components/Logo';

import { apiFetch } from '@/lib/api';

interface Report {
  submissionId: string;
  eventName: string;
  rating: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  summary: string;
  timestamp: string;
}

interface GeneratedSummary {
  pdfPath: string;
  emailSent: boolean;
}

export function Dashboard() {

  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    eventName: '',
    sentiment: 'All'
  });

  const [reports, setReports] = useState<Report[]>([]);
  const [eventNames, setEventNames] = useState<string[]>([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [generatedSummary, setGeneratedSummary] =
    useState<GeneratedSummary | null>(null);

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  /* --------------------------------
     Ensure YYYY-MM-DD format
  -------------------------------- */

  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  /* --------------------------------
     Extract Positive Comment Only
  -------------------------------- */

  const extractPositiveSummary = (summary: any) => {

    try {

      if (!summary) return '';

      if (typeof summary === 'string') {

        const parsed = JSON.parse(summary);

        if (parsed?.positive) return parsed.positive;

        return summary;

      }

      if (summary?.positive) return summary.positive;

      return '';

    } catch {

      return summary;

    }
  };

  /* --------------------------------
     Build Query
  -------------------------------- */

  const buildQuery = () => {

    const params = new URLSearchParams();

    if (filters.startDate)
      params.append('start_date', formatDate(filters.startDate));

    if (filters.endDate)
      params.append('end_date', formatDate(filters.endDate));

    if (filters.eventName)
      params.append('event_name', filters.eventName);

    if (filters.sentiment && filters.sentiment !== 'All')
      params.append('sentiment', filters.sentiment);

    return params.toString();
  };

  /* --------------------------------
     Load Reports
  -------------------------------- */

  const loadReports = async () => {

    try {

      setLoading(true);

      const query = buildQuery();

      const data = await apiFetch<any>(
        `/dashboard/dashboard/reports?${query}`
      );

      const reportsData = data.reports ?? data ?? [];

      const cleanedReports = reportsData.map((r: any) => ({
        ...r,
        summary: extractPositiveSummary(r.summary)
      }));

      setReports(cleanedReports);

      const names = [
        ...new Set(cleanedReports.map((r: Report) => r.eventName).filter(Boolean))
      ];

      setEventNames(names);

    } catch (error) {

      console.error(error);
      toast.error('Failed to load feedback reports');

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadReports();
  }, [filters]);

  /* --------------------------------
     Generate Summary Report
  -------------------------------- */

  const handleGenerateSummary = async () => {

    try {

      setGenerating(true);

      const query = buildQuery();

      const data = await apiFetch<GeneratedSummary>(
        `/summary/feedback/summary?${query}`,
        { method: 'POST' }
      );

      setGeneratedSummary(data);

      setShowSummaryModal(true);

      toast.success(
        data.emailSent
          ? 'Summary generated and sent to organizer'
          : 'Summary generated'
      );

    } catch (error) {

      console.error(error);
      toast.error('Failed to generate report');

    } finally {

      setGenerating(false);

    }
  };

  /* --------------------------------
     Download PDF
  -------------------------------- */

  const handleDownloadSummary = () => {

    if (!generatedSummary?.pdfPath) return;

    const link = document.createElement('a');
    link.href = generatedSummary.pdfPath;
    link.download = 'feedback-summary.pdf';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeSummaryModal = () => {
    setShowSummaryModal(false);
    setGeneratedSummary(null);
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <header className="bg-white border-b sticky top-0 z-10">

        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">

          <Logo />

          <h1 className="text-2xl font-bold">
            Analytics Dashboard
          </h1>

          <Button
            onClick={handleGenerateSummary}
            disabled={generating}
            className="bg-[#A6F4C5] hover:bg-[#88E5B5] text-black"
          >
            {generating ? 'Generating...' : 'Generate Date Range Summary'}
          </Button>

        </div>

      </header>

      {/* MAIN */}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        <DashboardFilters
          onFilter={setFilters}
          isLoading={loading}
          eventNames={eventNames}
        />

        <div>

          <h2 className="text-xl font-bold mb-4">
            Feedback Reports
          </h2>

          <FeedbackTable
            items={reports}
            isLoading={loading}
          />

        </div>

      </div>

      {/* SUMMARY MODAL */}

      <Dialog open={showSummaryModal} onOpenChange={closeSummaryModal}>

        <DialogContent className="sm:max-w-md">

          <DialogHeader>

            <DialogTitle>
              Summary Generated
            </DialogTitle>

            <DialogDescription>

              {generatedSummary
                ? generatedSummary.emailSent
                  ? 'Summary report generated and emailed to organizer.'
                  : 'Summary report generated.'
                : 'Generating summary...'}

            </DialogDescription>

          </DialogHeader>

          {generatedSummary && (

            <DialogFooter>

              <Button
                onClick={handleDownloadSummary}
                className="bg-[#A6F4C5] hover:bg-[#88E5B5] text-black"
              >
                Download PDF
              </Button>

              <Button
                variant="outline"
                onClick={closeSummaryModal}
              >
                Close
              </Button>

            </DialogFooter>

          )}

        </DialogContent>

      </Dialog>

    </main>
  );
}