import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'EventFeedback AI - Home',
  description: 'Intelligent event feedback collection and analysis',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <Logo />
          <Link
            href="/dashboard"
            className="text-black font-medium hover:text-gray-600 transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-black leading-tight">
              Intelligent Event Feedback, Powered by AI
            </h1>
            <p className="text-xl text-gray-600">
              Collect, analyze, and act on attendee feedback with advanced AI-powered insights. Transform event feedback into actionable intelligence.
            </p>

            {/* Features List */}
            <div className="space-y-4 mt-8">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#A6F4C5] flex-shrink-0 flex items-center justify-center mt-1">
                  <span className="text-black font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-black">Smart Feedback Collection</h3>
                  <p className="text-gray-600 text-sm">Easy-to-use forms with intuitive rating systems</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#A6F4C5] flex-shrink-0 flex items-center justify-center mt-1">
                  <span className="text-black font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-black">AI-Powered Analysis</h3>
                  <p className="text-gray-600 text-sm">Sentiment analysis and automated report generation</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#A6F4C5] flex-shrink-0 flex items-center justify-center mt-1">
                  <span className="text-black font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-black">Comprehensive Analytics</h3>
                  <p className="text-gray-600 text-sm">Real-time dashboards with detailed insights and trends</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link href="/feedback" className="flex-1">
                <Button className="w-full bg-[#A6F4C5] hover:bg-[#88E5B5] text-black font-semibold py-3 rounded-lg text-lg">
                  Share Feedback
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-black hover:bg-gray-50 font-semibold py-3 rounded-lg text-lg"
                >
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-[#A6F4C5] to-[#A6F4C5]/40 rounded-2xl p-12 aspect-square flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-black/20">📊</div>
                <p className="text-black/40 font-medium">Analytics & Insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#A6F4C5] mb-2">100%</div>
              <p className="text-gray-600">Data Privacy</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#A6F4C5] mb-2">AI-Powered</div>
              <p className="text-gray-600">Automated Insights</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#A6F4C5] mb-2">Real-Time</div>
              <p className="text-gray-600">Analytics Dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2024 EventFeedback AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
