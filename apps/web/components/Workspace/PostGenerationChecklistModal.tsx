'use client';

import Link from 'next/link';

interface PostGenerationChecklistModalProps {
  courseId: string;
  stageCount: number;
  onPreview: () => void;
  onClose: () => void;
}

export default function PostGenerationChecklistModal({
  courseId,
  stageCount,
  onPreview,
  onClose,
}: PostGenerationChecklistModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg1 border border-border rounded-lg max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">Course ready!</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-bg2 rounded" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-text-secondary mb-6">
          Generated {stageCount} stage{stageCount === 1 ? '' : 's'}. Here&apos;s what to do next:
        </p>
        <ol className="space-y-3 mb-6">
          <li className="flex items-start gap-3 p-3 bg-bg2 rounded-lg border border-border">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent1 text-white text-xs flex items-center justify-center font-bold">1</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Preview your course</p>
              <p className="text-xs text-text-secondary mt-0.5">See how learners will experience it</p>
            </div>
            <button
              type="button"
              onClick={onPreview}
              className="text-xs px-3 py-1.5 bg-accent1 text-white rounded-lg hover:opacity-90"
            >
              Preview
            </button>
          </li>
          <li className="flex items-start gap-3 p-3 bg-bg2 rounded-lg border border-border">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent1 text-white text-xs flex items-center justify-center font-bold">2</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Edit and refine</p>
              <p className="text-xs text-text-secondary mt-0.5">Adjust content, add media, reorder sections</p>
            </div>
            <Link
              href={`/app/${courseId}/preview-editor`}
              className="text-xs px-3 py-1.5 bg-bg3 border border-border rounded-lg hover:bg-bg2"
            >
              Edit
            </Link>
          </li>
          <li className="flex items-start gap-3 p-3 bg-bg2 rounded-lg border border-border">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent1 text-white text-xs flex items-center justify-center font-bold">3</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Export and publish</p>
              <p className="text-xs text-text-secondary mt-0.5">Download SCORM or HTML package</p>
            </div>
            <Link
              href={`/app/${courseId}/export`}
              className="text-xs px-3 py-1.5 bg-bg3 border border-border rounded-lg hover:bg-bg2"
            >
              Export
            </Link>
          </li>
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-2 text-sm bg-gradient-to-r from-accent1 to-accent2 text-white rounded-lg font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
}
