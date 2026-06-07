'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCourses } from '@/contexts/CourseContext';
import SudarBridge from '@/components/Export/SudarBridge';

export default function ExportPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { getCourse } = useCourses();
  const course = getCourse(projectId);
  const lastEdited = course?.lastModified ?? 0;
  const lastGenerated = course?.state?.courseData?.course?.generatedAt ?? 0;
  const isStale = lastEdited > lastGenerated + 60000 && lastGenerated > 0;

  const handleExport = async (format: 'scorm' | 'html' | 'json') => {
    if (!course?.state?.courseData) {
      alert('Generate module content before exporting.');
      return;
    }
    const res = await fetch('/api/export/scorm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseData: course.state.courseData,
        config: course.state.courseConfig || { title: course.title },
        format,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || 'Export failed');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.title || 'module'}-${format}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-bg1 p-8 max-w-2xl mx-auto">
      <Link href={`/app/${projectId}`} className="text-sm text-accent1 hover:underline mb-8 inline-block">
        ← Back to workspace
      </Link>
      <h1 className="text-2xl font-bold mb-2">Export module</h1>
      <p className="text-text-secondary text-sm mb-8">
        Download packages for your LMS or host on Sudar after import.
      </p>
      {isStale && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-600">
          Your course was edited after the last export. Export again to get the latest content.
        </div>
      )}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => handleExport('scorm')}
          className="neu-accent-button py-4 text-white font-semibold"
        >
          Download SCORM 1.2 ZIP
        </button>
        <button
          type="button"
          onClick={() => handleExport('html')}
          className="neu-button py-4 font-semibold"
        >
          Download HTML package
        </button>
      </div>
      <SudarBridge projectId={projectId} />
    </div>
  );
}
