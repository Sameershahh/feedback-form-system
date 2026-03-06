import { z } from 'zod';

export const feedbackFormSchema = z.object({
  eventName: z.string().min(1, 'Event name is required').trim(),
  eventDate: z.string().min(1, 'Event date is required'),
  attendeeName: z.string().min(1, 'Attendee name is required').trim(),
  attendeeEmail: z.string().email('Invalid email address').trim(),
  organizerEmail: z.string().email('Invalid email address').trim(),
  companyName: z.string().min(1, 'Company name is required').trim(),
  rating: z.number().int().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  comments: z.string().optional().default(''),
  suggestions: z.string().optional().default(''),
});

export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

export const feedbackSummarySchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  eventName: z.string().optional(),
  sentiment: z.enum(['All', 'Positive', 'Neutral', 'Negative']).optional(),
});

export type FeedbackSummaryParams = z.infer<typeof feedbackSummarySchema>;
