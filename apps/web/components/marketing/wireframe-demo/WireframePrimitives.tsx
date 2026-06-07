'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export function WireStagger({
  children,
  className = '',
  reducedMotion = false,
}: {
  children: React.ReactNode;
  className?: string;
  reducedMotion?: boolean;
}) {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function WireItem({
  children,
  className = '',
  reducedMotion = false,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  reducedMotion?: boolean;
  delay?: number;
}) {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerItem}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function WireBox({
  className = '',
  accent = false,
  dashed = true,
  ...props
}: HTMLMotionProps<'div'> & { accent?: boolean; dashed?: boolean }) {
  return (
    <motion.div
      className={[
        'rounded-lg bg-white/80',
        dashed ? 'border border-dashed border-[#c8cad8]' : 'border border-[#dfe1ea]',
        accent ? 'border-brand-primary/40 bg-brand-primary/[0.06] ring-1 ring-brand-primary/20' : '',
        className,
      ].join(' ')}
      {...props}
    />
  );
}

export function WireLine({
  width = '100%',
  height = '8px',
  className = '',
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-full bg-[#dfe1ea] ${className}`}
      style={{ width, height }}
      aria-hidden
    />
  );
}

export function WireChip({
  children,
  active = false,
  className = '',
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-space font-medium',
        active
          ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/30'
          : 'bg-[#eceef5] text-[#6b708a] border border-[#dfe1ea]',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

export function WirePanel({
  title,
  children,
  className = '',
  accent = false,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <WireBox accent={accent} className={`p-3 ${className}`} dashed={!accent}>
      {title ? (
        <p className="mb-2 text-[10px] font-space font-bold uppercase tracking-[0.2em] text-[#8b90a8]">
          {title}
        </p>
      ) : null}
      {children}
    </WireBox>
  );
}

export function WireButton({
  children,
  primary = false,
  exportTone = false,
  className = '',
}: {
  children: React.ReactNode;
  primary?: boolean;
  exportTone?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        'rounded-lg px-3 py-2 text-center text-[11px] font-space font-bold',
        primary
          ? 'bg-brand-primary text-white'
          : exportTone
            ? 'bg-brand-export/10 text-brand-export border border-brand-export/30'
            : 'bg-white text-[#4a4f68] border border-[#dfe1ea]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

export function WireBadge({
  children,
  tone = 'primary',
}: {
  children: React.ReactNode;
  tone?: 'primary' | 'success' | 'neutral';
}) {
  const toneClass =
    tone === 'success'
      ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/25'
      : tone === 'neutral'
        ? 'bg-[#eceef5] text-[#6b708a] border-[#dfe1ea]'
        : 'bg-brand-primary/10 text-brand-primary border-brand-primary/25';

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-space font-bold uppercase tracking-wider ${toneClass}`}
    >
      {children}
    </span>
  );
}
