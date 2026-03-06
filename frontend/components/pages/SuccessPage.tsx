'use client';

import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export function SuccessPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <CheckCircle2 size={80} className="text-[#A6F4C5]" />
        </div>

        {/* Messages */}
        <h1 className="text-3xl font-bold text-black mb-4">Thank you for your feedback!</h1>
        <p className="text-gray-600 mb-2">
          Your response has been recorded successfully.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          An AI-generated report has been sent to the event organizer.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => window.location.href = '/feedback'}
            className="w-full bg-[#A6F4C5] hover:bg-[#88E5B5] text-black font-semibold py-3 rounded-lg transition-colors"
          >
            Submit Another Feedback
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full border-gray-300 text-black hover:bg-gray-50 font-semibold py-3 rounded-lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
