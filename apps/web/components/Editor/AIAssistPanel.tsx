'use client';

import { useState } from 'react';
import { CourseData } from '@/types/course';
import { PencilIcon, PlusIcon, ChevronDownIcon, DocumentTextIcon, QuestionMarkIcon } from '@/components/Icons/AppleIcons';

interface AIAssistPanelProps {
  courseData: CourseData;
  selectedStageId: number;
  onUpdate: (data: CourseData) => void;
}

export default function AIAssistPanel({ courseData, selectedStageId, onUpdate }: AIAssistPanelProps) {
  const [selectedText, setSelectedText] = useState<string>('');
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentStage = courseData.course.stages.find(s => s.id === selectedStageId);

  const applyToStage = (original: string, transformed: string) => {
    if (!currentStage) return;
    const content = currentStage.content || { introduction: '', sections: [], summary: '' };
    const replaceIn = (text: string) => text.replace(original, transformed);

    let updated = { ...currentStage };
    if (content.introduction?.includes(original)) {
      updated = { ...updated, content: { ...content, introduction: replaceIn(content.introduction) } };
    } else if (content.summary?.includes(original)) {
      updated = { ...updated, content: { ...content, summary: replaceIn(content.summary) } };
    } else {
      const idx = content.sections.findIndex((s) =>
        (typeof s.content === 'string' ? s.content : '').includes(original)
      );
      if (idx >= 0) {
        const sections = [...content.sections];
        sections[idx] = {
          ...sections[idx],
          content: replaceIn(typeof sections[idx].content === 'string' ? sections[idx].content : ''),
        };
        updated = { ...updated, content: { ...content, sections } };
      }
    }

    onUpdate({
      ...courseData,
      course: {
        ...courseData.course,
        stages: courseData.course.stages.map((s) => (s.id === selectedStageId ? updated : s)),
      },
    });
  };

  const handleAIAction = async (actionType: 'rewrite' | 'expand' | 'simplify' | 'summarize') => {
    if (!selectedText.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai/transform-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedText,
          action: actionType,
          context: {
            courseTitle: courseData.course.title,
            stageTitle: currentStage?.title,
            stageObjective: currentStage?.objective,
          },
        }),
      });

      if (!response.ok) throw new Error('AI transformation failed');

      const data = await response.json();
      const result = data.result as string;
      setLastResult(result);
      applyToStage(selectedText, result);
    } catch (error) {
      console.error('AI action error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!currentStage) return;
    setIsProcessing(true);
    try {
      const response = await fetch('/api/generate/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageContent: currentStage.content,
          stageTitle: currentStage.title,
          stageObjective: currentStage.objective,
        }),
      });
      if (!response.ok) throw new Error('Quiz generation failed');
      const data = await response.json();
      const updatedStage = {
        ...currentStage,
        interactiveElements: [
          ...(currentStage.interactiveElements || []),
          { type: 'quiz' as const, data: data.quiz },
        ],
      };
      onUpdate({
        ...courseData,
        course: {
          ...courseData.course,
          stages: courseData.course.stages.map((s) =>
            s.id === selectedStageId ? updatedStage : s
          ),
        },
      });
    } catch (error) {
      console.error('Quiz generation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-80 bg-bg2 border-l border-border overflow-y-auto">
      <div className="p-4">
        <h2 className="font-semibold text-text-primary mb-4">AI Assistant</h2>
        <textarea
          value={selectedText}
          onChange={(e) => setSelectedText(e.target.value)}
          placeholder="Paste or type text to transform..."
          className="w-full p-2 text-sm border border-border rounded bg-bg1 text-text-primary mb-4 min-h-[80px]"
        />
        {lastResult && (
          <p className="text-xs text-green-500 mb-4">Last transform applied to matching field.</p>
        )}
        <div className="space-y-2 mb-4">
          {(['rewrite', 'expand', 'simplify', 'summarize'] as const).map((action) => (
            <button
              key={action}
              onClick={() => handleAIAction(action)}
              disabled={!selectedText || isProcessing}
              className="w-full px-4 py-2 text-sm glass-button rounded-lg text-left disabled:opacity-50 capitalize flex items-center gap-2"
            >
              {action === 'rewrite' && <PencilIcon className="w-4 h-4" />}
              {action === 'expand' && <PlusIcon className="w-4 h-4" />}
              {action === 'simplify' && <ChevronDownIcon className="w-4 h-4" />}
              {action === 'summarize' && <DocumentTextIcon className="w-4 h-4" />}
              {action}
            </button>
          ))}
        </div>
        <button
          onClick={handleGenerateQuiz}
          disabled={isProcessing}
          className="w-full px-4 py-2 text-sm bg-gradient-to-r from-accent1 to-accent2 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <QuestionMarkIcon className="w-4 h-4" />
          {isProcessing ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>
    </div>
  );
}
