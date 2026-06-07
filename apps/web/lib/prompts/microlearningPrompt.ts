/**
 * Microlearning-specific prompt framing (from ByteJul 10/70/15/5 model).
 * Used by outline and content generation — not learner delivery / tutor memory.
 */

export const MICROLEARNING_TIME_BUDGET = '3–7 minutes total learner time';

export const MICROLEARNING_STRUCTURE = `
Structure the module using this time budget:
- 10% Hook & context (activate prior knowledge, state relevance)
- 70% Core concept (one primary idea, progressive chunks, low cognitive load)
- 15% Practice (scenario, application, or knowledge check)
- 5% Recap (key takeaway + optional next step)
`;

export const MICROLEARNING_SYSTEM_PREFIX = `You are ByteAI, the instructional design engine for ByteVerse.
You help creators build a single microlearning MODULE (${MICROLEARNING_TIME_BUDGET}), not a full multi-hour course.
Align objectives to Bloom's Taxonomy. Apply ADDIE at module scale. ${MICROLEARNING_STRUCTURE}
Do not promise learner memory, adaptive tutoring, or LMS delivery—that is outside ByteVerse authoring.`;

export function microlearningOutlineInstructions(topic: string): string {
  return `${MICROLEARNING_SYSTEM_PREFIX}

Topic: ${topic}
Output a concise module outline with 3–6 stages maximum, each tagged with Bloom level and estimated minutes.`;
}
