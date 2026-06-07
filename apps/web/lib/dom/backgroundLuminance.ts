type Rgba = { r: number; g: number; b: number; a: number };

const imageSampleCache = new WeakMap<HTMLImageElement, CanvasRenderingContext2D>();

function parseRgba(color: string): Rgba | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] !== undefined ? Number(match[4]) : 1,
  };
}

export function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getImageSampleContext(img: HTMLImageElement): CanvasRenderingContext2D | null {
  const cached = imageSampleCache.get(img);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  imageSampleCache.set(img, ctx);
  return ctx;
}

function sampleImageLuminance(img: HTMLImageElement, clientX: number, clientY: number): number | null {
  if (!img.complete || img.naturalWidth === 0) return null;

  const rect = img.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
    return null;
  }

  const ctx = getImageSampleContext(img);
  if (!ctx) return null;

  const x = ((clientX - rect.left) / rect.width) * img.naturalWidth;
  const y = ((clientY - rect.top) / rect.height) * img.naturalHeight;

  try {
    ctx.clearRect(0, 0, 1, 1);
    ctx.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    if (a < 16) return null;
    return relativeLuminance(r, g, b) * (a / 255);
  } catch {
    return null;
  }
}

function getElementBackgroundLuminance(el: Element): number | null {
  let current: Element | null = el;

  while (current && current !== document.documentElement) {
    const { backgroundColor, backgroundImage } = getComputedStyle(current);

    if (backgroundImage && backgroundImage !== 'none') {
      const gradientMatch = backgroundImage.match(/rgba?\([^)]+\)/);
      if (gradientMatch) {
        const rgba = parseRgba(gradientMatch[0]);
        if (rgba && rgba.a > 0.08) {
          return relativeLuminance(rgba.r, rgba.g, rgba.b) * rgba.a;
        }
      }
    }

    const rgba = parseRgba(backgroundColor);
    if (rgba && rgba.a > 0.08) {
      return relativeLuminance(rgba.r, rgba.g, rgba.b) * rgba.a;
    }

    current = current.parentElement;
  }

  return null;
}

function getLuminanceAtPoint(x: number, y: number, excludeRoot: Element): number {
  const stack = document.elementsFromPoint(x, y);

  for (const el of stack) {
    if (excludeRoot.contains(el)) continue;

    if (el instanceof HTMLImageElement) {
      const imageLuminance = sampleImageLuminance(el, x, y);
      if (imageLuminance !== null) return imageLuminance;
      continue;
    }

    const backgroundLuminance = getElementBackgroundLuminance(el);
    if (backgroundLuminance !== null) return backgroundLuminance;
  }

  return 0;
}

export type ContrastMode = 'on-dark' | 'on-light';

export function sampleRegionLuminance(
  rect: DOMRect,
  excludeRoot: Element,
  sampleCount = 7,
): number {
  const y = rect.top + rect.height / 2;
  const inset = rect.width * 0.08;
  const startX = rect.left + inset;
  const endX = rect.right - inset;
  const step = sampleCount <= 1 ? 0 : (endX - startX) / (sampleCount - 1);

  let total = 0;
  for (let i = 0; i < sampleCount; i += 1) {
    const x = sampleCount <= 1 ? rect.left + rect.width / 2 : startX + step * i;
    total += getLuminanceAtPoint(x, y, excludeRoot);
  }

  return total / sampleCount;
}

const LIGHT_THRESHOLD = 0.42;
const DARK_THRESHOLD = 0.3;

export function resolveContrastMode(luminance: number, previous: ContrastMode): ContrastMode {
  if (previous === 'on-light') {
    return luminance < DARK_THRESHOLD ? 'on-dark' : 'on-light';
  }
  return luminance > LIGHT_THRESHOLD ? 'on-light' : 'on-dark';
}
