import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ByteVerse — Forever-free AI microlearning content generator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #0a0a12 0%, #1a1040 50%, #0a0a12 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            marginBottom: 24,
          }}
        >
          ByteVerse
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: '#a78bfa',
            marginBottom: 32,
          }}
        >
          Big ideas. Bite-sized.
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Forever-free AI microlearning — chat, create, export SCORM or HTML.
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 22,
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          byteverse.app
        </div>
      </div>
    ),
    { ...size },
  );
}
