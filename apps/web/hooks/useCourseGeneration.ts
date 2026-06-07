'use client';

import { useRef, useCallback, useState } from 'react';
import { CourseConfig, CourseData } from '@/types/course';
import { ChatMessage, CourseCreationState } from '@/types/courseCreation';
import { buildSourceChunksFromState, fetchWithAbortSignal } from '@/lib/generation/helpers';

export type GenerationStatus =
  | 'idle'
  | 'extracting'
  | 'outline'
  | 'generating'
  | 'complete'
  | 'awaiting_review';

export interface GenerationProgressState {
  status: GenerationStatus;
  progress: number;
  currentStage?: number;
  totalStages?: number;
  message?: string;
}

export interface UseCourseGenerationOptions {
  courseId: string;
  state: CourseCreationState;
  updateState: (updates: Partial<CourseCreationState>) => void;
  updateCourse: (id: string, updates: Record<string, unknown>) => Promise<void>;
  addChatMessage: (message: ChatMessage) => void;
  onConfigModal: (config: { config: Partial<CourseConfig>; confidence: Record<string, number> }) => void;
  onOutlineModal: (outline: CourseData['course']) => void;
  onComplete: (stageCount: number) => void;
  onError: (message: string) => void;
  setStudioOutputs: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  setCourseTitle?: (title: string) => void;
}

function buildSourceChunks(state: CourseCreationState) {
  return buildSourceChunksFromState(state);
}

async function fetchWithAbort(
  url: string,
  options: RequestInit,
  signal?: AbortSignal
) {
  return fetchWithAbortSignal(url, options, signal);
}

export function useCourseGeneration(options: UseCourseGenerationOptions) {
  const abortRef = useRef<AbortController | null>(null);
  const [progress, setProgress] = useState<GenerationProgressState>({ status: 'idle', progress: 0 });
  const [generating, setGenerating] = useState<string | null>(null);

  const persistProgress = useCallback(
    (p: GenerationProgressState) => {
      setProgress(p);
      options.updateState({
        generationProgress: {
          stage: p.status,
          progress: p.progress,
          status: p.message || p.status,
        },
      });
    },
    [options]
  );

  const cancelGeneration = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setGenerating(null);
    persistProgress({ status: 'idle', progress: 0 });
  }, [persistProgress]);

  const generateCourseStages = useCallback(
    async (outline: CourseData['course'], config: CourseConfig) => {
      const signal = abortRef.current?.signal;
      const stages = outline.stages;
      const totalStages = stages.length;
      const generatedStages: CourseData['course']['stages'] = [];

      persistProgress({
        status: 'generating',
        progress: 30,
        currentStage: 0,
        totalStages,
        message: 'Starting content generation...',
      });

      for (let i = 0; i < stages.length; i++) {
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

        const stage = stages[i];
        const stageProgress = 30 + ((i + 1) / totalStages) * 60;

        persistProgress({
          status: 'generating',
          progress: stageProgress,
          currentStage: i + 1,
          totalStages,
          message: `Generating Stage ${i + 1}: ${stage.title}...`,
        });

        let content: Record<string, unknown> | null = null;
        let retries = 3;
        let lastError: unknown;

        while (retries > 0) {
          try {
            const contentResponse = await fetchWithAbort(
              '/api/generate/content',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  config,
                  stage: {
                    id: stage.id,
                    title: stage.title,
                    objective: stage.objective,
                    keyPoints: stage.keyPoints || [],
                  },
                  provider: 'together',
                  contextSessionId: options.state.contextSessionId,
                  sourceChunks: buildSourceChunks(options.state),
                }),
              },
              signal
            );

            if (!contentResponse.ok) {
              const errorData = await contentResponse.json().catch(() => ({}));
              throw new Error(errorData.error || `Failed to generate content for stage ${i + 1}`);
            }

            content = await contentResponse.json();
            break;
          } catch (error) {
            lastError = error;
            if (error instanceof DOMException && error.name === 'AbortError') throw error;
            retries--;
            if (retries > 0) {
              await new Promise((r) => setTimeout(r, 2000));
            }
          }
        }

        if (!content) {
          throw new Error(
            lastError instanceof Error
              ? `Failed to generate Stage ${i + 1}: ${lastError.message}`
              : `Failed to generate content for stage ${i + 1}`
          );
        }

        generatedStages.push({
          ...stage,
          content: {
            introduction: (content.introduction as string) || '',
            sections: (content.sections as CourseData['course']['stages'][0]['content']['sections']) || [],
            summary: (content.summary as string) || '',
          },
          interactiveElements: (content.interactiveElements as CourseData['course']['stages'][0]['interactiveElements']) || [],
          sideCard: (content.sideCard as CourseData['course']['stages'][0]['sideCard']) || null,
        });

        const partialCourseData: CourseData = {
          course: { ...outline, stages: generatedStages },
          videoScenes: [],
          podcastDialogue: [],
        };

        const updatedState = { ...options.state, courseData: partialCourseData };
        options.updateState(updatedState);
        await options.updateCourse(options.courseId, { state: updatedState, stageCount: generatedStages.length });

        options.setStudioOutputs((prev) => ({
          ...prev,
          course: {
            ...(prev.course as object),
            course: { ...outline, stages: generatedStages },
          },
        }));
      }

      const courseTitle =
        config.title && config.title !== 'Untitled Course'
          ? config.title
          : outline.title || 'Untitled Course';

      const fullCourseData: CourseData = {
        course: {
          ...outline,
          title: courseTitle,
          stages: generatedStages,
          generatedAt: Date.now(),
        },
        videoScenes: [],
        podcastDialogue: [],
      };

      const finalState = {
        ...options.state,
        courseData: fullCourseData,
        courseConfig: config,
      };
      options.updateState(finalState);
      await options.updateCourse(options.courseId, { state: finalState });

      persistProgress({ status: 'complete', progress: 100, message: 'Course generation complete!' });

      fetch('/api/course/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseData: fullCourseData,
          config,
          courseId: options.courseId,
        }),
      }).catch(console.error);

      setTimeout(() => {
        persistProgress({ status: 'idle', progress: 0 });
        setGenerating(null);
        options.onComplete(totalStages);
      }, 1500);
    },
    [options, persistProgress]
  );

  const generateCourseOutline = useCallback(
    async (config: CourseConfig) => {
      const signal = abortRef.current?.signal;
      persistProgress({ status: 'outline', progress: 20, message: 'Generating course outline...' });

      const outlineResponse = await fetchWithAbort(
        '/api/generate/outline',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            config,
            provider: 'together',
            contextSessionId: options.state.contextSessionId,
            sourceChunks: buildSourceChunks(options.state),
            chatHistory: options.state.chatHistory.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          }),
        },
        signal
      );

      if (!outlineResponse.ok) throw new Error('Failed to generate course outline');

      const outlineData = await outlineResponse.json();
      const outline = outlineData.course as CourseData['course'];

      if (config.title && config.title !== 'Untitled Course') {
        outline.title = config.title;
      }

      const outlineOnlyData: CourseData = {
        course: outline,
        videoScenes: [],
        podcastDialogue: [],
      };

      const updatedState = {
        ...options.state,
        courseData: outlineOnlyData,
        courseConfig: config,
      };
      options.updateState(updatedState);
      await options.updateCourse(options.courseId, {
        state: updatedState,
        stageCount: outline.stages.length,
        title: outline.title,
      });

      options.setStudioOutputs((prev) => ({
        ...prev,
        course: { type: 'course', course: outline, config, generatedAt: Date.now() },
      }));

      options.onOutlineModal(outline);
      persistProgress({
        status: 'awaiting_review',
        progress: 35,
        message: 'Review the outline to continue',
      });
    },
    [options, persistProgress]
  );

  const startProgressiveGeneration = useCallback(async () => {
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    try {
      const hasSources = options.state.uploadedFiles.length > 0;
      const hasConversation = options.state.chatHistory.length >= 3;
      if (!hasSources && !hasConversation) {
        throw new Error('Please upload sources or describe your course topic in the chat first');
      }

      options.setStudioOutputs({});
      setGenerating('course');

      if (
        options.state.courseData?.course.stages?.length &&
        options.state.courseData.course.stages[0]?.content
      ) {
        return { needsOverwrite: true, stageCount: options.state.courseData.course.stages.length };
      }

      const preservedTemplateId = options.state.courseConfig?.templateId;

      if (options.state.courseConfig) {
        await generateCourseOutline(options.state.courseConfig as CourseConfig);
        return { needsOverwrite: false };
      }

      persistProgress({
        status: 'extracting',
        progress: 10,
        message: 'Extracting course configuration...',
      });

      const extractResponse = await fetchWithAbort(
        '/api/context/extract-config',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatHistory: options.state.chatHistory,
            uploadedFiles: options.state.uploadedFiles,
          }),
        },
        signal
      );

      if (!extractResponse.ok) throw new Error('Failed to extract course configuration');

      const extractData = await extractResponse.json();
      if (preservedTemplateId && !extractData.config.templateId) {
        extractData.config.templateId = preservedTemplateId;
      }

      options.onConfigModal(extractData);
      persistProgress({
        status: 'awaiting_review',
        progress: 15,
        message: 'Review configuration to continue',
      });
      return { needsOverwrite: false };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return { needsOverwrite: false };
      const msg = error instanceof Error ? error.message : 'Failed to generate course';
      options.onError(msg);
      setGenerating(null);
      persistProgress({ status: 'idle', progress: 0 });
      throw error;
    }
  }, [generateCourseOutline, options, persistProgress]);

  return {
    progress,
    generating,
    setGenerating,
    persistProgress,
    cancelGeneration,
    startProgressiveGeneration,
    generateCourseOutline,
    generateCourseStages,
    abortRef,
  };
}
