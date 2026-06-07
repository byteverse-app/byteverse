import { NextResponse } from 'next/server';

export function apiError(
  message: string,
  status: number,
  context?: string
): NextResponse {
  if (context) {
    console.error(`[api:${context}]`, message);
  }
  return NextResponse.json({ error: message }, { status });
}

export function internalError(error: unknown, context: string): NextResponse {
  console.error(`[api:${context}]`, error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
