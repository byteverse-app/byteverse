import { CourseConfig } from '@/types/course';

export function toFullCourseConfig(
  partial: Partial<CourseConfig> | null | undefined,
  fallbackTitle = 'Untitled Course'
): CourseConfig {
  return {
    title: partial?.title || fallbackTitle,
    topic: partial?.topic || 'General',
    description: partial?.description || 'A microlearning course',
    objectives: partial?.objectives || ['Learn key concepts'],
    targetAudience: partial?.targetAudience || 'General audience',
    organizationalGoals: partial?.organizationalGoals || '',
    contentStyle: partial?.contentStyle || 'conversational',
    stageCount: partial?.stageCount || 5,
    estimatedDuration: partial?.estimatedDuration || '15-20 minutes',
    accentColor1: partial?.accentColor1 || '#4a90e2',
    accentColor2: partial?.accentColor2 || '#50c9c3',
    voiceId: partial?.voiceId || '',
    includeVideo: partial?.includeVideo ?? false,
    includePodcast: partial?.includePodcast ?? false,
    templateId: partial?.templateId,
    tts: partial?.tts,
    enableContentValidation: partial?.enableContentValidation,
    enableAutoImages: partial?.enableAutoImages,
    imageProvider: partial?.imageProvider,
  };
}
