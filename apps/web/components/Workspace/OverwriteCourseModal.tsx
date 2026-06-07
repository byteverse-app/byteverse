'use client';

interface OverwriteCourseModalProps {
  existingStageCount: number;
  onKeepExisting: () => void;
  onReplaceAll: () => void;
  onRegenerateFromOutline: () => void;
  onCancel: () => void;
}

export default function OverwriteCourseModal({
  existingStageCount,
  onKeepExisting,
  onReplaceAll,
  onRegenerateFromOutline,
  onCancel,
}: OverwriteCourseModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg1 border border-border rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-text-primary mb-2">Course already exists</h2>
        <p className="text-sm text-text-secondary mb-6">
          This workspace has a course with {existingStageCount} stage{existingStageCount === 1 ? '' : 's'}.
          What would you like to do?
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onKeepExisting}
            className="w-full px-4 py-2.5 text-sm bg-bg2 border border-border rounded-lg hover:bg-bg3 text-left"
          >
            Keep existing course
          </button>
          <button
            type="button"
            onClick={onRegenerateFromOutline}
            className="w-full px-4 py-2.5 text-sm bg-bg2 border border-border rounded-lg hover:bg-bg3 text-left"
          >
            Regenerate from outline only
          </button>
          <button
            type="button"
            onClick={onReplaceAll}
            className="w-full px-4 py-2.5 text-sm bg-accent1/10 border border-accent1/30 text-accent1 rounded-lg hover:bg-accent1/20 text-left font-medium"
          >
            Replace all — start fresh generation
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary mt-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
