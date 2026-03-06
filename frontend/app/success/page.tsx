import { Metadata } from 'next';
import { SuccessPage } from '@/components/pages/SuccessPage';

export const metadata: Metadata = {
  title: 'Feedback Submitted | EventFeedback AI',
  description: 'Your feedback has been submitted successfully',
};

export default function SuccessPageRoute() {
  return <SuccessPage />;
}
