import { Metadata } from 'next';
import { Dashboard } from '@/components/pages/Dashboard';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | EventFeedback AI',
  description: 'View event feedback analytics and insights',
};

export default function DashboardPage() {
  return <Dashboard />;
}
