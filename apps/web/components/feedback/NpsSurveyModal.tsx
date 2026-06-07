'use client';

import { useState } from 'react';

interface NpsSurveyModalProps {
  onClose: () => void;
}

export default function NpsSurveyModal({ onClose }: NpsSurveyModalProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const showFollowUp = rating !== null && (rating <= 6 || rating >= 9);

  const handleDismiss = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/feedback/nps/dismiss', { method: 'POST' });
    } catch {
      // Still close; sessionStorage prevents repeat prompts this session
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (rating === null) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback/nps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment: comment.trim() || undefined }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(onClose, 2000);
      }
    } catch {
      // Allow retry
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg1 border border-border rounded-lg max-w-lg w-full p-6">
        {submitted ? (
          <div className="text-center py-4">
            <p className="text-lg font-semibold text-text-primary">Thank you!</p>
            <p className="text-sm text-text-secondary mt-2">Your feedback helps us improve ByteVerse.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-text-primary pr-4">
                How likely are you to recommend ByteVerse to a colleague?
              </h2>
              <button
                type="button"
                onClick={handleDismiss}
                disabled={submitting}
                className="p-2 hover:bg-bg2 rounded flex-shrink-0"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex justify-between text-xs text-text-tertiary mb-2">
              <span>Not at all likely</span>
              <span>Extremely likely</span>
            </div>

            <div className="grid grid-cols-11 gap-1 mb-4">
              {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  disabled={submitting}
                  className={`h-9 rounded-lg border text-sm font-medium transition-colors ${
                    rating === n
                      ? 'border-accent1 bg-accent1/20 text-accent1'
                      : 'border-border hover:border-accent1/50 text-text-secondary'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {showFollowUp && (
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  rating !== null && rating <= 6
                    ? 'What is the main reason for your score?'
                    : 'What do you love most about ByteVerse?'
                }
                rows={3}
                className="w-full px-3 py-2 text-sm bg-bg2 border border-border rounded-lg mb-4"
              />
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDismiss}
                disabled={submitting}
                className="flex-1 px-4 py-2 text-sm border border-border rounded-lg hover:bg-bg2"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={rating === null || submitting}
                className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-accent1 to-accent2 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
