'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCourses } from '@/contexts/CourseContext';
import { CourseData, CourseConfig } from '@/types/course';
import { toFullCourseConfig } from '@/lib/generation/configHelpers';
import VisualHTMLEditor from '@/components/Editor/VisualHTMLEditor';
import LivePreviewPanel from '@/components/Editor/LivePreviewPanel';
import HTMLPreview from '@/components/Editor/HTMLPreview';
import StyleEditor from '@/components/Editor/StyleEditor';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function PreviewEditorPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { getCourse, updateCourse, loading: coursesLoading } = useCourses();

  const [course, setCourse] = useState<ReturnType<typeof getCourse>>(null);
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [courseConfig, setCourseConfig] = useState<CourseConfig | null>(null);
  const [previewMode, setPreviewMode] = useState<'editor' | 'html' | 'live'>('editor');
  const [previewKey, setPreviewKey] = useState(0);
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [history, setHistory] = useState<CourseData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const skipHistoryRef = useRef(false);

  useEffect(() => {
    if (coursesLoading || !courseId) return;

    const loaded = getCourse(courseId);
    if (loaded) {
      setCourse(loaded);
      setCourseData(loaded.state.courseData || null);
      setCourseConfig(
        loaded.state.courseConfig
          ? toFullCourseConfig(loaded.state.courseConfig, loaded.title)
          : null
      );
      if (loaded.state.courseData) {
        setHistory([loaded.state.courseData]);
        setHistoryIndex(0);
      }
    } else {
      router.push('/app');
    }
    setLoading(false);
  }, [courseId, coursesLoading, getCourse, router]);

  const persistCourse = useCallback(async (data: CourseData, config: CourseConfig | null) => {
    if (!course) return;
    setSaveStatus('saving');
    try {
      await updateCourse(courseId, {
        state: {
          ...course.state,
          courseData: data,
          courseConfig: config ?? course.state.courseConfig,
        },
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  }, [course, courseId, updateCourse]);

  useEffect(() => {
    if (!courseData || !courseId || loading) return;

    const timeoutId = setTimeout(() => {
      void persistCourse(courseData, courseConfig);
      setPreviewKey((prev) => prev + 1);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [courseData, courseConfig, courseId, loading, persistCourse]);

  useEffect(() => {
    if (previewMode !== 'editor' && courseData) {
      setPreviewKey((prev) => prev + 1);
    }
  }, [courseData, courseConfig, previewMode]);

  const pushHistory = useCallback((data: CourseData) => {
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, data];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUpdateCourseData = (updated: CourseData) => {
    setCourseData(updated);
    pushHistory(updated);
  };

  const handleUpdateConfig = (updated: CourseConfig) => {
    setCourseConfig(updated);
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    skipHistoryRef.current = true;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setCourseData(history[newIndex]);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    skipHistoryRef.current = true;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setCourseData(history[newIndex]);
  };

  const handleManualSave = () => {
    if (courseData && courseConfig) {
      void persistCourse(courseData, courseConfig);
      fetch('/api/course/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseData, config: courseConfig, courseId }),
      }).catch(console.error);
      setPreviewKey((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setPreviewMode((m) => (m === 'editor' ? 'live' : 'editor'));
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'r' && previewMode !== 'editor') {
        e.preventDefault();
        setPreviewKey((prev) => prev + 1);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [previewMode, history, historyIndex, courseData, courseConfig]);

  if (loading || coursesLoading) {
    return (
      <div className="min-h-screen bg-bg1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent1 mx-auto mb-4" />
          <p className="text-text-secondary">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!course || !courseData || !courseConfig) {
    return (
      <div className="min-h-screen bg-bg1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Course not found or no content available.</p>
          <Link href="/app" className="text-accent1 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const saveLabel =
    saveStatus === 'saving' ? 'Saving...' :
    saveStatus === 'saved' ? 'Saved to cloud' :
    saveStatus === 'error' ? 'Save failed' : '';

  return (
    <div className="h-screen flex flex-col bg-bg1">
      <header className="liquid-glass-header px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/app/${courseId}`} className="text-accent1 hover:underline">
            ← Back to Workspace
          </Link>
          <h1 className="text-xl font-semibold text-text-primary">Editor: {course.title}</h1>
          {saveLabel && (
            <span className={`text-xs px-2 py-1 rounded ${
              saveStatus === 'error' ? 'bg-red-500/20 text-red-500' :
              saveStatus === 'saved' ? 'bg-green-500/20 text-green-500' :
              'bg-bg3 text-text-secondary'
            }`}>
              {saveLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="px-3 py-1.5 text-sm bg-bg2 border border-border rounded-lg hover:bg-bg3 disabled:opacity-40 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="px-3 py-1.5 text-sm bg-bg2 border border-border rounded-lg hover:bg-bg3 disabled:opacity-40 transition-colors"
            title="Redo (Ctrl+Y)"
          >
            Redo
          </button>
          <button
            onClick={() => setShowStyleEditor(true)}
            className="px-3 py-1.5 text-sm bg-bg2 border border-border rounded-lg hover:bg-bg3 transition-colors"
          >
            Style
          </button>
          <div className="flex items-center gap-1 bg-bg2 rounded-lg p-1 border border-border">
            <button
              onClick={() => setPreviewMode('editor')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                previewMode === 'editor' ? 'bg-accent1 text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Visual Editor
            </button>
            <button
              onClick={() => setPreviewMode('html')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                previewMode === 'html' ? 'bg-accent1 text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              HTML Preview
            </button>
            <button
              onClick={() => setPreviewMode('live')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                previewMode === 'live' ? 'bg-accent1 text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Live Preview
            </button>
          </div>
          <Link
            href={`/app/${courseId}/export`}
            className="px-3 py-1.5 text-sm bg-bg2 border border-border rounded-lg hover:bg-bg3 transition-colors"
          >
            Export
          </Link>
          <button
            onClick={handleManualSave}
            className="px-4 py-2 text-sm bg-gradient-to-r from-accent1 to-accent2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {previewMode === 'editor' && (
          <div className="flex-1">
            <VisualHTMLEditor
              courseData={courseData}
              courseConfig={courseConfig}
              courseId={courseId}
              onUpdate={handleUpdateCourseData}
              onUpdateConfig={handleUpdateConfig}
            />
          </div>
        )}
        {previewMode === 'html' && (
          <div className="flex-1 overflow-hidden">
            <HTMLPreview courseData={courseData} config={courseConfig} key={previewKey} />
          </div>
        )}
        {previewMode === 'live' && (
          <div className="flex-1 overflow-hidden flex">
            <div className="flex-1">
              <VisualHTMLEditor
                courseData={courseData}
                courseConfig={courseConfig}
                onUpdate={handleUpdateCourseData}
                onUpdateConfig={handleUpdateConfig}
              />
            </div>
            <LivePreviewPanel
              courseData={courseData}
              config={courseConfig}
              templateId={courseConfig.templateId as import('@/lib/templates/templateSelector').TemplateId | undefined}
              onClose={() => setPreviewMode('editor')}
              key={previewKey}
            />
          </div>
        )}
      </div>

      {showStyleEditor && courseConfig && (
        <StyleEditor
          config={courseConfig}
          onUpdate={handleUpdateConfig}
          onClose={() => setShowStyleEditor(false)}
        />
      )}
    </div>
  );
}
