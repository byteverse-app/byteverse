'use client';

import { CourseCreationState } from '@/types/courseCreation';

interface WorkflowProgressProps {
  state: CourseCreationState;
  courseId?: string;
  onAction?: (action: WorkflowAction) => void;
  awaitingReview?: 'config' | 'outline' | null;
}

export type WorkflowAction =
  | 'upload'
  | 'plan'
  | 'configure'
  | 'generate'
  | 'edit'
  | 'publish';

type WorkflowStage = WorkflowAction;

const workflowStages: { id: WorkflowStage; label: string; description: string }[] = [
  { id: 'upload', label: 'Upload', description: 'Add sources and content' },
  { id: 'plan', label: 'Plan', description: 'Chat with AI to plan course' },
  { id: 'configure', label: 'Configure', description: 'Set course settings' },
  { id: 'generate', label: 'Generate', description: 'Create course content' },
  { id: 'edit', label: 'Edit', description: 'Refine and customize' },
  { id: 'publish', label: 'Publish', description: 'Export and publish' },
];

function getCurrentStage(state: CourseCreationState): WorkflowStage {
  const hasContent = state.courseData?.course.stages?.some((s) => s.content);
  if (hasContent) return 'edit';
  if (state.courseData?.course.stages?.length) return 'generate';
  if (state.courseConfig) return 'configure';
  if (state.chatHistory.length >= 3 || state.uploadedFiles.length > 0) return 'plan';
  return 'upload';
}

function getNextStepMessage(state: CourseCreationState): { message: string; action?: WorkflowAction } {
  const hasSources = state.uploadedFiles.length > 0;
  const hasConversation = state.chatHistory.filter((m) => m.role === 'user').length >= 2;
  const hasConfig = !!state.courseConfig;
  const hasContent = state.courseData?.course.stages?.some((s) => s.content);

  if (hasContent) {
    return { message: 'Course generated! Edit your content or export when ready.', action: 'edit' };
  }
  if (state.courseData?.course.stages?.length && !hasContent) {
    return { message: 'Outline ready — approve it to generate full content.', action: 'generate' };
  }
  if (hasConfig) {
    return { message: 'Configuration set — generate your course outline.', action: 'generate' };
  }
  if (hasSources || hasConversation) {
    return { message: 'Ready to extract configuration — click Generate in the studio panel.', action: 'configure' };
  }
  if (hasSources) {
    return { message: 'Sources uploaded — chat with AI or generate directly.', action: 'plan' };
  }
  return {
    message: 'Upload at least one source or send 3 chat messages to unlock generation.',
    action: 'upload',
  };
}

function getGroundingLabel(state: CourseCreationState): string {
  const fileCount = state.uploadedFiles.length;
  const chatOnly = fileCount === 0 && state.chatHistory.length >= 3;
  if (fileCount >= 2) return `Grounding: Strong (${fileCount} sources)`;
  if (fileCount === 1) return 'Grounding: Moderate (1 source)';
  if (chatOnly) return 'Grounding: Weak (chat only — upload sources for better results)';
  return 'Grounding: None';
}

export default function WorkflowProgress({
  state,
  courseId,
  onAction,
  awaitingReview,
}: WorkflowProgressProps) {
  const currentStage = getCurrentStage(state);
  const currentIndex = workflowStages.findIndex((s) => s.id === currentStage);
  const nextStep = getNextStepMessage(state);
  const grounding = getGroundingLabel(state);

  const handleStageClick = (stage: WorkflowStage, index: number) => {
    if (!onAction) return;
    if (index <= currentIndex || stage === currentStage) {
      onAction(stage);
    }
  };

  return (
    <div className="px-6 py-3 bg-bg2 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {workflowStages.map((stage, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            const isClickable = !!onAction && (isCompleted || isActive);

            return (
              <div key={stage.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStageClick(stage.id, index)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center ${isClickable ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}`}
                  title={stage.description}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-accent1 text-white ring-2 ring-accent1/50'
                        : 'bg-bg3 text-text-tertiary'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="mt-1 text-center">
                    <div
                      className={`text-xs font-medium ${
                        isActive ? 'text-accent1' : isCompleted ? 'text-green-500' : 'text-text-tertiary'
                      }`}
                    >
                      {stage.label}
                    </div>
                  </div>
                </button>
                {index < workflowStages.length - 1 && (
                  <div className={`w-12 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="ml-4 text-right">
          <div className="text-xs text-text-secondary">
            Current: <span className="font-semibold text-accent1">{workflowStages[currentIndex]?.label}</span>
          </div>
          <div className="text-xs text-text-tertiary mt-0.5">{grounding}</div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <p className="text-xs text-text-secondary flex-1">
          {awaitingReview === 'config' && (
            <span className="text-yellow-500 font-medium">Awaiting your review — check the configuration modal. </span>
          )}
          {awaitingReview === 'outline' && (
            <span className="text-yellow-500 font-medium">Awaiting your review — check the outline modal. </span>
          )}
          {nextStep.message}
        </p>
        {onAction && nextStep.action && (
          <button
            type="button"
            onClick={() => onAction(nextStep.action!)}
            className="text-xs px-3 py-1.5 bg-accent1/10 text-accent1 border border-accent1/30 rounded-lg hover:bg-accent1/20 transition-colors whitespace-nowrap"
          >
            {nextStep.action === 'upload' && 'Add sources'}
            {nextStep.action === 'plan' && 'Open chat'}
            {nextStep.action === 'configure' && 'Generate course'}
            {nextStep.action === 'generate' && 'Continue generation'}
            {nextStep.action === 'edit' && 'Open editor'}
            {nextStep.action === 'publish' && 'Export'}
          </button>
        )}
      </div>
    </div>
  );
}

export { getCurrentStage, getNextStepMessage, getGroundingLabel };
