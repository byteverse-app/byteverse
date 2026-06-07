'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCourses } from '@/contexts/CourseContext';
import { useCourseCreation } from '@/contexts/CourseCreationContext';
import TemplateSelector from '@/components/Templates/TemplateSelector';
import { TemplateId } from '@/lib/templates/templateSelector';
import { CourseCreationState } from '@/types/courseCreation';

export default function NewCoursePage() {
  const router = useRouter();
  const { createCourse } = useCourses();
  const { clearState } = useCourseCreation();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
  const [creating, setCreating] = useState(false);

  const createAndNavigate = async (freshState: CourseCreationState) => {
    if (creating) return;
    setCreating(true);
    try {
      clearState();
      const courseId = await createCourse('Untitled course', freshState);
      router.push(`/app/${courseId}`);
    } catch (error) {
      console.error('Failed to create course:', error);
      setCreating(false);
    }
  };

  const handleTemplateSelect = (templateId: TemplateId) => {
    void createAndNavigate({
      uploadedFiles: [],
      totalChunks: 0,
      chatHistory: [],
      chatSessions: [],
      currentChatSessionId: null,
      aiInsights: null,
      courseConfig: { templateId } as CourseCreationState['courseConfig'],
      courseData: null,
      generationProgress: null,
      mediaAssets: [],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      currentStage: 1,
      contextSessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
  };

  const handleCancel = () => {
    router.push('/app');
  };

  const handleStartBlank = () => {
    void createAndNavigate({
      uploadedFiles: [],
      totalChunks: 0,
      chatHistory: [],
      chatSessions: [],
      currentChatSessionId: null,
      aiInsights: null,
      courseConfig: null,
      courseData: null,
      generationProgress: null,
      mediaAssets: [],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      currentStage: 1,
      contextSessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
  };

  return (
    <TemplateSelector
      selectedTemplate={selectedTemplate}
      onSelectTemplate={(templateId) => {
        setSelectedTemplate(templateId);
      }}
      onApply={(templateId) => {
        handleTemplateSelect(templateId);
      }}
      onClose={handleCancel}
      onStartBlank={handleStartBlank}
    />
  );
}
