'use client';

import Link from 'next/link';

export default function SudarBridge({ projectId }: { projectId?: string }) {
  return (
    <div className="rounded-2xl border border-brand-primary/30 bg-brand-primary/5 p-6 mt-6">
      <h3 className="font-semibold text-lg mb-2">Deploy with Sudar</h3>
      <p className="text-sm text-text-secondary mb-4 leading-relaxed">
        Export SCORM from ByteVerse, then import the ZIP in Sudar Studio to publish adaptive learning on Sudar
        Learn. ByteVerse creates; Sudar hosts and adapts.
      </p>
      <ol className="text-sm text-text-secondary list-decimal list-inside space-y-1 mb-4">
        <li>Download your SCORM 1.2 package below</li>
        <li>Open Sudar Studio → Import SCORM</li>
        <li>Publish to learners on Sudar Learn</li>
      </ol>
      <div className="flex flex-wrap gap-3">
        <a
          href="https://teachwithsudar.com"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-bg2"
        >
          About Sudar
        </a>
        {projectId && (
          <Link
            href={`/app/${projectId}`}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-tertiary"
          >
            Back to workspace
          </Link>
        )}
      </div>
    </div>
  );
}
