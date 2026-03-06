'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RatingStars } from '@/components/RatingStars';
import { Logo } from '@/components/Logo';
import { feedbackFormSchema, FeedbackFormData } from '@/lib/validators';
import { useApi } from '@/hooks/useApi';

export function FeedbackForm() {
  const router = useRouter();
  const { execute, loading } = useApi();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      eventName: '',
      eventDate: '',
      attendeeName: '',
      attendeeEmail: '',
      organizerEmail: '',
      companyName: '',
      rating: 0,
      comments: '',
      suggestions: '',
    },
  });

  const rating = watch('rating');

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      await execute('/feedback/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      toast.success('Feedback submitted successfully!');
      router.push('/success');
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Event Feedback</h1>
          <p className="text-gray-600">Help us improve your experience</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl border-2 border-[#A6F4C5] shadow-md p-8"
        >
          <div className="space-y-6">
            {/* Event Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black">Event Information</h2>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('eventName')}
                  placeholder="Enter event name"
                  className="rounded-lg border-gray-300 focus:border-[#A6F4C5] focus:ring-[#A6F4C5]"
                />
                {errors.eventName && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('eventDate')}
                  type="date"
                  className="rounded-lg border-gray-300 focus:border-[#A6F4C5] focus:ring-[#A6F4C5]"
                />
                {errors.eventDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>
                )}
              </div>
            </div>

            {/* Attendee Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black">Your Information</h2>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('attendeeName')}
                  placeholder="Your name"
                  className="rounded-lg border-gray-300 focus:border-[#A6F4C5] focus:ring-[#A6F4C5]"
                />
                {errors.attendeeName && (
                  <p className="text-red-500 text-sm mt-1">{errors.attendeeName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('attendeeEmail')}
                  type="email"
                  placeholder="your.email@example.com"
                  className="rounded-lg border-gray-300 focus:border-[#A6F4C5] focus:ring-[#A6F4C5]"
                />
                {errors.attendeeEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.attendeeEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('companyName')}
                  placeholder="Your company"
                  className="rounded-lg border-gray-300 focus:border-[#A6F4C5] focus:ring-[#A6F4C5]"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                )}
              </div>
            </div>

            {/* Organizer Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black">Event Organizer</h2>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Organizer Email <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('organizerEmail')}
                  type="email"
                  placeholder="organizer@example.com"
                  className="rounded-lg border-gray-300 focus:border-[#A6F4C5] focus:ring-[#A6F4C5]"
                />
                {errors.organizerEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.organizerEmail.message}</p>
                )}
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black">Your Feedback</h2>

              <RatingStars
                value={rating}
                onChange={(value) => setValue('rating', value)}
                required={true}
                label="How would you rate this event?"
              />
              {errors.rating && (
                <p className="text-red-500 text-sm">{errors.rating.message}</p>
              )}

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Comments
                </label>
                <Textarea
                  {...register('comments')}
                  placeholder="Share your thoughts about the event..."
                  rows={4}
                  className="rounded-lg border-gray-300 focus:border-[#A6F4C5] focus:ring-[#A6F4C5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Suggestions for Improvement
                </label>
                <Textarea
                  {...register('suggestions')}
                  placeholder="How can we improve the event?"
                  rows={4}
                  className="rounded-lg border-gray-300 focus:border-[#A6F4C5] focus:ring-[#A6F4C5]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-[#A6F4C5] hover:bg-[#88E5B5] text-black font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
