import { Metadata } from 'next';
import { FeedbackForm } from '@/components/pages/FeedbackForm';

export const metadata: Metadata = {
  title: 'Event Feedback Form | EventFeedback AI',
  description: 'Share your feedback about our event',
};

export default function FeedbackPage() {
  return <FeedbackForm />;
}
